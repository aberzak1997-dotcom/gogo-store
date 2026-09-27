-- ══════════════════════════════════════════════════════════════════════════
-- WIVITEC — Admin security hardening
--
-- 1. Admins are listed in public.admin_users (not user_metadata, which any
--    signed-in user can edit about themselves).
-- 2. Admin database access requires an admin session that has passed 2FA
--    (aal2) whenever the admin has a verified authenticator.
-- 3. Signed-in shoppers get the same catalog/checkout access as guests,
--    plus read access to their OWN orders, returns and customer record.
--    Previously every signed-in user had full read/write on every table.
--
-- Run once in Supabase → SQL Editor. Safe to re-run.
-- BEFORE RUNNING: check the admin email list in step 1.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Admin registry ────────────────────────────────────────────────────
create table if not exists public.admin_users (
  id         uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- No policies: only the security-definer functions below can read it.
revoke all on public.admin_users from anon, authenticated;

-- Seed admins by email. Edit this list before running.
-- Each email must already exist as a user in Authentication → Users.
insert into public.admin_users (id)
select id from auth.users
where lower(email) in (
  'm.aberzak@wivitec.com'
)
on conflict do nothing;

-- ── 2. Helper functions ──────────────────────────────────────────────────
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where id = auth.uid());
$$;

-- Admin AND (session is aal2, or the admin has no verified 2FA factor yet)
create or replace function public.is_admin_mfa()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.is_admin() and (
    coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
    or not exists (
      select 1 from auth.mfa_factors
      where user_id = auth.uid() and status = 'verified'
    )
  );
$$;

-- Email of the signed-in user, lower-cased, for "own rows" policies
create or replace function public.auth_email()
returns text
language sql stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''));
$$;

-- Legacy RPC kept for older clients; now backed by admin_users.
drop function if exists public.get_user_role(uuid);
create function public.get_user_role(id uuid)
returns text
language sql stable security definer
set search_path = public
as $$
  select case when id = auth.uid() and public.is_admin() then 'admin' else 'customer' end;
$$;

revoke all on function public.is_admin(), public.is_admin_mfa(), public.get_user_role(uuid) from public;
grant execute on function public.is_admin(), public.is_admin_mfa(), public.auth_email(), public.get_user_role(uuid)
  to anon, authenticated;

-- ── 3. Replace every policy on the store tables ──────────────────────────
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
    where schemaname = 'public' and tablename in (
      'products','product_variants','customers','orders','order_items','order_timeline',
      'discounts','reviews','return_requests','return_items','campaigns','collections',
      'collection_products','store_settings'
    )
  loop
    execute format('drop policy %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Admins (2FA-verified): full access
create policy "admin_all" on public.products            for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.product_variants    for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.customers           for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.orders              for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.order_items         for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.order_timeline      for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.discounts           for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.reviews             for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.return_requests     for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.return_items        for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.campaigns           for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.collections         for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.collection_products for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());
create policy "admin_all" on public.store_settings      for all to authenticated using (public.is_admin_mfa()) with check (public.is_admin_mfa());

-- Everyone (guests and signed-in shoppers): catalog
create policy "public_read_products" on public.products         for select to anon, authenticated using (status = 'active');
create policy "public_read_variants" on public.product_variants for select to anon, authenticated using (true);
create policy "public_read_reviews"  on public.reviews          for select to anon, authenticated using (status = 'approved');
create policy "public_read_settings" on public.store_settings   for select to anon, authenticated using (true);

-- Everyone: client-side checkout and return requests
create policy "public_insert_orders"    on public.orders          for insert to anon, authenticated with check (true);
create policy "public_insert_items"     on public.order_items     for insert to anon, authenticated with check (true);
create policy "public_insert_timeline"  on public.order_timeline  for insert to anon, authenticated with check (true);
create policy "public_insert_customers" on public.customers       for insert to anon, authenticated with check (true);
create policy "public_insert_returns"   on public.return_requests for insert to anon, authenticated with check (true);
create policy "public_insert_ret_items" on public.return_items    for insert to anon, authenticated with check (true);

-- Signed-in shoppers: their own records only
create policy "own_customer_read"   on public.customers for select to authenticated using (lower(email) = public.auth_email());
create policy "own_customer_update" on public.customers for update to authenticated
  using (lower(email) = public.auth_email()) with check (lower(email) = public.auth_email());
create policy "own_orders_read" on public.orders for select to authenticated using (lower(email) = public.auth_email());
create policy "own_order_items_read" on public.order_items for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and lower(o.email) = public.auth_email())
);
create policy "own_order_timeline_read" on public.order_timeline for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and lower(o.email) = public.auth_email())
);
create policy "own_returns_read" on public.return_requests for select to authenticated using (lower(email) = public.auth_email());
create policy "own_return_items_read" on public.return_items for select to authenticated using (
  exists (select 1 from public.return_requests r where r.id = return_id and lower(r.email) = public.auth_email())
);

-- Signed-in shoppers: active discount codes (keeps checkout discount codes
-- working as before; move to a server-side validation RPC later)
create policy "shopper_read_active_discounts" on public.discounts for select to authenticated using (is_active);

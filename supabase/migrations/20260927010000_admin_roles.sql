-- ══════════════════════════════════════════════════════════════════════════
-- WIVITEC — Admin users & roles
--
-- Roles (stored on public.admin_users.role):
--   super_admin       everything, including managing other admin users
--   store_manager     products, inventory, orders, discounts, marketing, analytics
--   customer_support  orders and customers
-- Anyone NOT in admin_users is a customer (storefront only).
--
-- What each role may do lives in public.role_permissions. Access is enforced
-- by RLS through public.has_permission() / has_any_permission(), on top of
-- the existing 2FA rule (is_admin_mfa). The admin UI only mirrors this.
--
-- admin_users stays closed to the browser: users are read and changed only
-- through the security-definer RPCs at the bottom of this file.
--
-- Requires 20260927000000_admin_security.sql. Run in Supabase → SQL Editor.
-- Safe to re-run.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 1. Roles on admin_users ──────────────────────────────────────────────
alter table public.admin_users
  add column if not exists role       text,
  add column if not exists is_active  boolean not null default true,
  add column if not exists invited_by uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

-- Admins that existed before roles were introduced keep full access
update public.admin_users set role = 'super_admin' where role is null;

alter table public.admin_users alter column role set not null;
alter table public.admin_users alter column role set default 'customer_support';

alter table public.admin_users drop constraint if exists admin_users_role_check;
alter table public.admin_users add constraint admin_users_role_check
  check (role in ('super_admin', 'store_manager', 'customer_support'));

-- ── 2. Role → permission map ─────────────────────────────────────────────
create table if not exists public.role_permissions (
  role        text primary key,
  permissions jsonb not null default '{}',
  description text,
  created_at  timestamptz not null default now()
);
alter table public.role_permissions enable row level security;
-- Not secret: lets the admin UI show what each role can do.
-- Edit permissions here in the SQL editor; there is no browser write access.
drop policy if exists "role_permissions_read" on public.role_permissions;
create policy "role_permissions_read" on public.role_permissions
  for select to authenticated using (true);
revoke insert, update, delete on public.role_permissions from anon, authenticated;

insert into public.role_permissions (role, permissions, description) values
  ('super_admin', '{
      "products": true, "inventory": true, "orders": true, "customers": true,
      "discounts": true, "marketing": true, "settings": true, "security": true,
      "users": true, "analytics": true
    }', 'Full access to everything'),
  ('store_manager', '{
      "products": true, "inventory": true, "orders": true, "customers": false,
      "discounts": true, "marketing": true, "settings": false, "security": false,
      "users": false, "analytics": true
    }', 'Products, inventory, orders, discounts and marketing'),
  ('customer_support', '{
      "products": false, "inventory": false, "orders": true, "customers": true,
      "discounts": false, "marketing": false, "settings": false, "security": false,
      "users": false, "analytics": false
    }', 'Orders and customers only')
on conflict (role) do update
  set permissions = excluded.permissions,
      description = excluded.description;

-- ── 3. Helper functions ──────────────────────────────────────────────────
-- Staff = active row in admin_users. Customers are never in admin_users.
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where id = auth.uid() and is_active
  );
$$;

create or replace function public.get_my_role()
returns text
language sql stable security definer
set search_path = public
as $$
  select role from public.admin_users where id = auth.uid() and is_active;
$$;

-- Permissions of the signed-in staff member ('{}' for everyone else)
create or replace function public.my_permissions()
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select coalesce((
    select case
      when a.role = 'super_admin' then
        (select jsonb_object_agg(k, true)
           from jsonb_object_keys((select permissions from public.role_permissions where role = 'super_admin')) k)
      else rp.permissions
    end
    from public.admin_users a
    left join public.role_permissions rp on rp.role = a.role
    where a.id = auth.uid() and a.is_active
  ), '{}'::jsonb);
$$;

-- True when the staff member has passed 2FA (if enrolled) and holds ANY of
-- the given permissions. super_admin always passes.
create or replace function public.has_any_permission(permission_keys text[])
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.is_admin_mfa() and (
    public.get_my_role() = 'super_admin'
    or exists (
      select 1 from unnest(permission_keys) k
      where coalesce((public.my_permissions() ->> k)::boolean, false)
    )
  );
$$;

create or replace function public.has_permission(permission_key text)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select public.has_any_permission(array[permission_key]);
$$;

revoke all on function public.get_my_role(), public.my_permissions(),
  public.has_any_permission(text[]), public.has_permission(text) from public;
grant execute on function public.get_my_role(), public.my_permissions(),
  public.has_any_permission(text[]), public.has_permission(text) to anon, authenticated;

-- ── 4. Per-permission RLS on the store tables ────────────────────────────
-- Replaces the single "admin_all" policy from the security migration.
-- Public / shopper policies from that migration are untouched.
do $$
declare
  t record;
begin
  for t in
    select * from (values
      ('products',            array['products','inventory']),
      ('product_variants',    array['products','inventory']),
      ('collections',         array['products']),
      ('collection_products', array['products']),
      ('orders',              array['orders']),
      ('order_items',         array['orders']),
      ('order_timeline',      array['orders']),
      ('return_requests',     array['orders']),
      ('return_items',        array['orders']),
      ('customers',           array['customers']),
      ('reviews',             array['products','customers']),
      ('discounts',           array['discounts']),
      ('campaigns',           array['marketing']),
      ('store_settings',      array['settings'])
    ) as v(tbl, perms)
  loop
    execute format('drop policy if exists "admin_all" on public.%I', t.tbl);
    execute format('drop policy if exists "staff_access" on public.%I', t.tbl);
    execute format(
      'create policy "staff_access" on public.%I for all to authenticated
         using (public.has_any_permission(%L::text[]))
         with check (public.has_any_permission(%L::text[]))',
      t.tbl, t.perms, t.perms
    );
  end loop;
end $$;

-- ── 5. RPCs for the admin UI ─────────────────────────────────────────────
-- Signed-in user's staff profile; returns no row for customers.
create or replace function public.get_my_admin_profile()
returns table (id uuid, email text, role text, permissions jsonb)
language sql stable security definer
set search_path = public
as $$
  select a.id, u.email::text, a.role, public.my_permissions()
  from public.admin_users a
  join auth.users u on u.id = a.id
  where a.id = auth.uid() and a.is_active;
$$;

create or replace function public.admin_list_users()
returns table (
  id uuid, email text, role text, is_active boolean,
  last_sign_in_at timestamptz, created_at timestamptz
)
language plpgsql stable security definer
set search_path = public
as $$
begin
  if not public.has_permission('users') then
    raise exception 'You do not have permission to manage users' using errcode = '42501';
  end if;
  return query
    select a.id, u.email::text, a.role, a.is_active, u.last_sign_in_at, a.created_at
    from public.admin_users a
    join auth.users u on u.id = a.id
    order by a.created_at;
end;
$$;

-- Internal guard shared by the write RPCs below
create or replace function public._assert_can_manage_user(target uuid)
returns void
language plpgsql stable security definer
set search_path = public
as $$
begin
  if not (public.has_permission('users') and public.get_my_role() = 'super_admin') then
    raise exception 'Only a Super Admin can manage users' using errcode = '42501';
  end if;
  -- Blocks locking yourself out; also guarantees one active super admin remains
  if target = auth.uid() then
    raise exception 'You cannot change your own role or access' using errcode = '42501';
  end if;
end;
$$;

-- Give an existing account staff access. The person must have signed up
-- (storefront account or Google sign-in) so an auth user exists.
create or replace function public.admin_add_user(p_email text, p_role text)
returns uuid
language plpgsql security definer
set search_path = public
as $$
declare
  target uuid;
begin
  select id into target from auth.users where lower(email) = lower(trim(p_email)) limit 1;
  if target is null then
    raise exception 'No account found for %. Ask them to create an account first, then add them here.', p_email
      using errcode = 'P0002';
  end if;
  perform public._assert_can_manage_user(target);

  insert into public.admin_users (id, role, is_active, invited_by, updated_at)
  values (target, p_role, true, auth.uid(), now())
  on conflict (id) do update
    set role = excluded.role, is_active = true, updated_at = now();
  return target;
end;
$$;

create or replace function public.admin_update_user(
  p_user_id uuid, p_role text default null, p_is_active boolean default null
)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  perform public._assert_can_manage_user(p_user_id);
  update public.admin_users
    set role       = coalesce(p_role, role),
        is_active  = coalesce(p_is_active, is_active),
        updated_at = now()
  where id = p_user_id;
  if not found then
    raise exception 'User is not a staff member' using errcode = 'P0002';
  end if;
end;
$$;

-- Removes staff access only; the person's customer account is kept.
create or replace function public.admin_remove_user(p_user_id uuid)
returns void
language plpgsql security definer
set search_path = public
as $$
begin
  perform public._assert_can_manage_user(p_user_id);
  delete from public.admin_users where id = p_user_id;
end;
$$;

revoke all on function public.get_my_admin_profile(), public.admin_list_users(),
  public._assert_can_manage_user(uuid), public.admin_add_user(text, text),
  public.admin_update_user(uuid, text, boolean), public.admin_remove_user(uuid) from public;
grant execute on function public.get_my_admin_profile(), public.admin_list_users(),
  public.admin_add_user(text, text), public.admin_update_user(uuid, text, boolean),
  public.admin_remove_user(uuid) to authenticated;

-- ── Verify ───────────────────────────────────────────────────────────────
select a.role, u.email, a.is_active
from public.admin_users a join auth.users u on u.id = a.id
order by a.role;

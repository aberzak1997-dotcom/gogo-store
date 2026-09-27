-- ============================================================
-- WIVITEC — SUPABASE SCHEMA
-- Paste this entire file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- PRODUCTS
-- ────────────────────────────────────────────────────────────
create table if not exists products (
  id            text primary key default gen_random_uuid()::text,
  title         text not null,
  description   text default '',
  sku           text unique not null,
  brand         text default '',
  category      text default '',
  subcategory   text default '',
  price         numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock_quantity  integer default 0,
  image_url     text default '',
  gallery_images  text[] default '{}',
  rating        numeric(3,2) default 0,
  review_count  integer default 0,
  status        text default 'draft' check (status in ('active','draft')),
  compatibility text[] default '{}',
  specs         jsonb default '{}',
  warranty      text default '1 Year',
  condition     text default 'new' check (condition in ('new','refurbished','used')),
  created_at    timestamptz default now()
);

create table if not exists product_variants (
  id             text primary key default gen_random_uuid()::text,
  product_id     text references products(id) on delete cascade,
  option_name    text default '',
  option_value   text default '',
  sku            text unique,
  price          numeric(10,2) not null,
  stock_quantity integer default 0,
  image_url      text
);

-- ────────────────────────────────────────────────────────────
-- CUSTOMERS
-- ────────────────────────────────────────────────────────────
create table if not exists customers (
  id              text primary key default gen_random_uuid()::text,
  name            text not null,
  email           text unique not null,
  phone           text,
  location        text,
  total_orders    integer default 0,
  total_spent     numeric(10,2) default 0,
  last_order_date timestamptz,
  status          text default 'active' check (status in ('active','returning','VIP','blocked')),
  notes           text,
  tags            text[] default '{}',
  created_at      timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- ORDERS
-- ────────────────────────────────────────────────────────────
create table if not exists orders (
  id                 text primary key,
  customer_name      text not null,
  email              text not null,
  phone              text,
  address            text,
  city               text,
  country            text,
  date               timestamptz default now(),
  status             text default 'pending' check (status in ('pending','processing','shipped','delivered','cancelled','refunded')),
  payment_status     text default 'unpaid' check (payment_status in ('unpaid','paid','partially_refunded','refunded')),
  fulfillment_status text default 'unfulfilled' check (fulfillment_status in ('unfulfilled','fulfilled','partial')),
  total_amount       numeric(10,2) not null,
  notes              text,
  internal_notes     text
);

create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   text references orders(id) on delete cascade,
  product_id text,
  variant_id text,
  title      text,
  quantity   integer not null,
  price      numeric(10,2) not null
);

create table if not exists order_timeline (
  id       uuid primary key default gen_random_uuid(),
  order_id text references orders(id) on delete cascade,
  status   text not null,
  date     timestamptz default now(),
  note     text
);

-- ────────────────────────────────────────────────────────────
-- DISCOUNTS
-- ────────────────────────────────────────────────────────────
create table if not exists discounts (
  id               text primary key default gen_random_uuid()::text,
  code             text unique not null,
  type             text check (type in ('percentage','fixed')),
  value            numeric(10,2) not null,
  min_order_amount numeric(10,2),
  max_uses         integer,
  used_count       integer default 0,
  expires_at       timestamptz,
  is_active        boolean default true,
  created_at       timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- REVIEWS
-- ────────────────────────────────────────────────────────────
create table if not exists reviews (
  id            text primary key default gen_random_uuid()::text,
  product_id    text references products(id) on delete cascade,
  product_title text,
  customer_name text,
  rating        integer check (rating between 1 and 5),
  comment       text,
  status        text default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- RETURNS
-- ────────────────────────────────────────────────────────────
create table if not exists return_requests (
  id            text primary key,
  order_id      text references orders(id) on delete set null,
  customer_name text,
  email         text,
  reason        text,
  status        text default 'requested' check (status in ('requested','approved','rejected','refunded')),
  requested_at  timestamptz default now(),
  refund_amount numeric(10,2)
);

create table if not exists return_items (
  id         uuid primary key default gen_random_uuid(),
  return_id  text references return_requests(id) on delete cascade,
  product_id text,
  variant_id text,
  title      text,
  quantity   integer,
  price      numeric(10,2)
);

-- ────────────────────────────────────────────────────────────
-- MARKETING CAMPAIGNS
-- ────────────────────────────────────────────────────────────
create table if not exists campaigns (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  type        text check (type in ('email','social','banner')),
  status      text default 'draft' check (status in ('draft','active','paused','ended')),
  start_date  timestamptz,
  end_date    timestamptz,
  budget      numeric(10,2),
  description text,
  created_at  timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- COLLECTIONS
-- ────────────────────────────────────────────────────────────
create table if not exists collections (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  description text,
  created_at  timestamptz default now()
);

create table if not exists collection_products (
  collection_id text references collections(id) on delete cascade,
  product_id    text references products(id) on delete cascade,
  primary key (collection_id, product_id)
);

-- ────────────────────────────────────────────────────────────
-- STORE SETTINGS  (single row, id always = 1)
-- ────────────────────────────────────────────────────────────
create table if not exists store_settings (
  id                      integer primary key default 1 check (id = 1),
  store_name              text default 'ElectroStore',
  contact_email           text default 'support@electrostore.com',
  currency                text default 'USD',
  tax_rate                numeric(5,4) default 0.07,
  free_shipping_threshold numeric(10,2) default 50,
  maintenance_mode        boolean default false
);

insert into store_settings (id) values (1) on conflict (id) do nothing;

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ────────────────────────────────────────────────────────────
alter table products          enable row level security;
alter table product_variants  enable row level security;
alter table customers         enable row level security;
alter table orders            enable row level security;
alter table order_items       enable row level security;
alter table order_timeline    enable row level security;
alter table discounts         enable row level security;
alter table reviews           enable row level security;
alter table return_requests   enable row level security;
alter table return_items      enable row level security;
alter table campaigns         enable row level security;
alter table collections       enable row level security;
alter table collection_products enable row level security;
alter table store_settings    enable row level security;

-- ── Policies ─────────────────────────────────────────────────────────────
-- Row-level security policies, the admin_users table and the is_admin() /
-- is_admin_mfa() helpers live in:
--   supabase/migrations/20260927000000_admin_security.sql
-- Run that file after this one.

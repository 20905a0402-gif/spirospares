-- Spirospares ecommerce transactional schema for Supabase
-- Run this script in Supabase SQL Editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_ref text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  fulfillment_mode text not null check (fulfillment_mode in ('delivery', 'pickup')),
  pickup_point text,
  express_delivery boolean not null default false,
  subtotal_kes integer not null check (subtotal_kes > 0),
  delivery_fee_kes integer not null default 0 check (delivery_fee_kes >= 0),
  total_kes integer generated always as (subtotal_kes + delivery_fee_kes) stored,
  currency text not null default 'KES',
  payment_status text not null default 'pending_payment' check (payment_status in ('pending_payment', 'paid', 'payment_failed', 'refunded')),
  order_status text not null default 'pending_payment' check (order_status in ('pending_payment', 'paid', 'processing', 'fulfilled', 'cancelled')),
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_type text not null check (product_type in ('bike', 'spare', 'gadget', 'insurance')),
  product_name text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price_kes integer not null check (unit_price_kes >= 0),
  line_total_kes integer generated always as (quantity * unit_price_kes) stored,
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items(order_id);

create table if not exists public.stock_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  product_type text not null check (product_type in ('bike', 'spare', 'gadget', 'insurance')),
  quantity integer not null check (quantity > 0),
  status text not null default 'active' check (status in ('active', 'expired', 'released', 'committed')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger stock_reservations_set_updated_at
before update on public.stock_reservations
for each row execute function public.set_updated_at();

create index if not exists idx_stock_reservations_order_id on public.stock_reservations(order_id);
create index if not exists idx_stock_reservations_expires_at on public.stock_reservations(expires_at);

create table if not exists public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'mpesa' check (provider in ('mpesa')),
  idempotency_key text not null unique,
  merchant_request_id text,
  checkout_request_id text unique,
  status text not null default 'initiated' check (status in ('initiated', 'pending', 'paid', 'failed')),
  result_code integer,
  result_desc text,
  mpesa_receipt_number text,
  paid_phone text,
  amount_kes integer,
  raw_request jsonb,
  raw_response jsonb,
  callback_payload jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger payment_attempts_set_updated_at
before update on public.payment_attempts
for each row execute function public.set_updated_at();

create index if not exists idx_payment_attempts_order_id on public.payment_attempts(order_id);
create index if not exists idx_payment_attempts_checkout_request_id on public.payment_attempts(checkout_request_id);

create table if not exists public.mpesa_callbacks (
  id uuid primary key default gen_random_uuid(),
  checkout_request_id text,
  merchant_request_id text,
  result_code integer,
  payload jsonb not null,
  processed boolean not null default false,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

create index if not exists idx_mpesa_callbacks_checkout_request_id on public.mpesa_callbacks(checkout_request_id);

create table if not exists public.idempotency_keys (
  key text primary key,
  route text not null,
  request_hash text not null,
  status_code integer,
  response_payload jsonb,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists idx_idempotency_keys_expires_at on public.idempotency_keys(expires_at);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_type text not null default 'system',
  actor_id text,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at);

-- Security baseline: block direct client access; use service role from Worker for writes.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.stock_reservations enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.mpesa_callbacks enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.audit_logs enable row level security;

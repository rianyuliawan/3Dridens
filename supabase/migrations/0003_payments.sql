-- 3Dridens platform — payments via Midtrans Snap (Phase 4)
-- Run this in the Supabase SQL editor after 0001 and 0002.

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) not null,
  purpose text not null check (purpose in ('dp', 'full', 'pelunasan')),
  amount numeric(12, 2) not null,
  midtrans_order_id text unique not null,
  snap_token text,
  status text not null default 'pending'
    check (status in ('pending', 'settlement', 'capture', 'deny', 'cancel', 'expire', 'failure')),
  payment_type text,
  raw_notification jsonb,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments enable row level security;

create trigger payments_touch_updated_at
  before update on public.payments
  for each row execute function public.touch_updated_at();

-- Read-only for customers (own orders) and admin. All writes (insert on Snap
-- token creation, update on webhook notification) go through the service-role
-- client in application code, bypassing RLS on purpose — customers must never
-- be able to fabricate a "settlement" status for themselves.
create policy "payments: select own or admin"
  on public.payments for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );

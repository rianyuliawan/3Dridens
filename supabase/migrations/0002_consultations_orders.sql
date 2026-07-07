-- 3Dridens platform — consultation → pricing → order flow (Phase 3)
-- Run this in the Supabase SQL editor after 0001_init.sql.

-- ============================================================
-- 1. consultations (customer-submitted request)
-- ============================================================

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles (id) not null,
  type text not null check (type in ('design', 'printing', 'both')),
  title text not null,
  description text,
  material_pref text,
  quantity integer,
  deadline date,
  reference_links text[],
  status text not null default 'new'
    check (status in ('new', 'discussing', 'quoted', 'converted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.consultations enable row level security;

create policy "consultations: customer insert own"
  on public.consultations for insert
  with check (auth.uid() = customer_id);

create policy "consultations: select own or admin"
  on public.consultations for select
  using (auth.uid() = customer_id or public.is_admin());

create policy "consultations: update own or admin"
  on public.consultations for update
  using (auth.uid() = customer_id or public.is_admin());

-- ============================================================
-- 2. consultation_messages (lightweight thread)
-- ============================================================

create table public.consultation_messages (
  id uuid primary key default gen_random_uuid(),
  consultation_id uuid references public.consultations (id) on delete cascade not null,
  sender_id uuid references public.profiles (id) not null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.consultation_messages enable row level security;

create policy "consultation_messages: select if owner or admin"
  on public.consultation_messages for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.consultations c
      where c.id = consultation_id and c.customer_id = auth.uid()
    )
  );

create policy "consultation_messages: insert if owner or admin"
  on public.consultation_messages for insert
  with check (
    auth.uid() = sender_id
    and (
      public.is_admin()
      or exists (
        select 1 from public.consultations c
        where c.id = consultation_id and c.customer_id = auth.uid()
      )
    )
  );

-- ============================================================
-- 3. orders (created by admin from a consultation)
-- ============================================================

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique,
  consultation_id uuid references public.consultations (id),
  customer_id uuid references public.profiles (id) not null,
  status text not null default 'awaiting_payment'
    check (status in (
      'awaiting_payment', 'processing', 'ready_to_ship',
      'shipped', 'completed', 'cancelled'
    )),
  design_fee numeric(12, 2) not null default 0,
  printing_fee numeric(12, 2) not null default 0,
  finishing_fee numeric(12, 2) not null default 0,
  shipping_fee numeric(12, 2) not null default 0,
  total_amount numeric(12, 2) generated always as
    (design_fee + printing_fee + finishing_fee + shipping_fee) stored,
  payment_scheme text not null default 'full' check (payment_scheme in ('dp', 'full')),
  dp_percent integer not null default 50,
  amount_paid numeric(12, 2) not null default 0,
  current_stage text not null default 'konsultasi'
    check (current_stage in (
      'konsultasi', 'estimasi', 'pembayaran', 'desain',
      'produksi', 'finishing', 'qc_kirim'
    )),
  material text,
  quantity integer,
  admin_note text,
  tracking_number text,
  shipped_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create sequence public.order_number_seq start 1;

create function public.generate_order_number()
returns trigger
language plpgsql
as $$
begin
  if new.order_number is null then
    new.order_number := '3DR-' || to_char(now(), 'YYMM') || '-' ||
      lpad(nextval('public.order_number_seq')::text, 3, '0');
  end if;
  return new;
end;
$$;

create trigger set_order_number
  before insert on public.orders
  for each row execute function public.generate_order_number();

create policy "orders: select own or admin"
  on public.orders for select
  using (auth.uid() = customer_id or public.is_admin());

create policy "orders: admin write"
  on public.orders for all
  using (public.is_admin())
  with check (public.is_admin());

-- Keep updated_at fresh on every order edit (pricing/status changes happen often).
create function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger orders_touch_updated_at
  before update on public.orders
  for each row execute function public.touch_updated_at();

create trigger consultations_touch_updated_at
  before update on public.consultations
  for each row execute function public.touch_updated_at();

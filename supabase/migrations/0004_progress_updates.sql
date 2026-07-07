-- 3Dridens platform — production progress tracking with photos (Phase 5)
-- Run this in the Supabase SQL editor after 0001, 0002, and 0003.

create table public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders (id) not null,
  stage text not null check (stage in (
    'konsultasi', 'estimasi', 'pembayaran', 'desain',
    'produksi', 'finishing', 'qc_kirim'
  )),
  note text,
  photo_paths text[] not null default '{}',
  created_by uuid references public.profiles (id) not null,
  created_at timestamptz not null default now()
);

alter table public.progress_updates enable row level security;

create policy "progress_updates: select own order or admin"
  on public.progress_updates for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );

-- Only admin can post updates (writes go through the service-role client from
-- the upload Server Action, but this policy also covers direct dashboard use).
create policy "progress_updates: admin insert"
  on public.progress_updates for insert
  with check (public.is_admin());

-- Private bucket for production photos. Never exposed via a public/select
-- storage policy — signed URLs are always minted server-side after verifying
-- the requesting user owns the order (or is admin), so no storage.objects
-- policies are needed beyond the bucket existing.
insert into storage.buckets (id, name, public)
values ('order-progress', 'order-progress', false)
on conflict (id) do nothing;

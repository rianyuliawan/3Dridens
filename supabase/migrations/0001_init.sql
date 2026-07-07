-- 3Dridens platform — initial schema (Phase 1 & 2)
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query) on a fresh project.
-- Safe to run once; re-running will error on "already exists" (expected).

-- ============================================================
-- 1. profiles (mirrors auth.users, adds role)
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Auto-create a profile row whenever a new auth.users row appears
-- (covers both email/password signup and Google OAuth).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper used throughout RLS policies to check the caller's role.
create function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles: select own or admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles: update own or admin"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

-- ============================================================
-- 2. testimonials (public read, admin write)
-- ============================================================

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  role_or_context text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "testimonials: public read published"
  on public.testimonials for select
  using (is_published = true or public.is_admin());

create policy "testimonials: admin write"
  on public.testimonials for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 3. portfolio_items (public read, admin write)
-- ============================================================

create table public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  image_url text not null,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.portfolio_items enable row level security;

create policy "portfolio_items: public read published"
  on public.portfolio_items for select
  using (is_published = true or public.is_admin());

create policy "portfolio_items: admin write"
  on public.portfolio_items for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- 4. Seed data (dummy content — replace later via /admin)
-- ============================================================

insert into public.testimonials (customer_name, role_or_context, quote, rating) values
  ('Raka Pratama', 'Pemilik brand aksesoris custom', 'Prosesnya jelas dari awal sampai akhir. Update progress dikirim rutin jadi saya tidak perlu tanya-tanya terus.', 5),
  ('Dinda Amelia', 'Mahasiswa Desain Produk', 'Bantuan desainnya sangat membantu, model saya yang awalnya susah dicetak jadi bisa disesuaikan tanpa mengubah bentuk aslinya.', 5),
  ('Bagus Setiawan', 'Founder startup IoT', 'Hasil cetak presisi untuk enclosure sensor kami. Toleransi ukurannya pas, tidak perlu revisi berkali-kali.', 4),
  ('Sari Wulandari', 'Content creator', 'Suka banget sama hasil finishing-nya, halus dan warnanya sesuai referensi yang saya kirim.', 5);

insert into public.portfolio_items (title, category, description, image_url, sort_order) values
  ('Prototype Cetak 3D Custom', 'Prototype', 'Cetak prototype presisi langsung dari mesin FDM untuk kebutuhan pengujian bentuk dan fungsi.', 'https://images.unsplash.com/photo-1702863361902-93c51bfbd923?w=1200&q=80&auto=format&fit=crop', 1),
  ('Miniatur Figurin Detail Tinggi', 'Miniatur', 'Figurin dan miniatur dengan detail halus, cocok untuk koleksi maupun hadiah custom.', 'https://images.unsplash.com/photo-1781027237929-ee1b0448c812?w=1200&q=80&auto=format&fit=crop', 2),
  ('Part Fungsional Presisi', 'Fungsional', 'Komponen fungsional dengan toleransi ketat untuk kebutuhan perakitan dan mekanikal.', 'https://images.unsplash.com/photo-1611505982706-9ebc79e5d3f1?w=1200&q=80&auto=format&fit=crop', 3),
  ('Proses Desain dari Sketsa', 'Desain Custom', 'Kolaborasi desain mulai dari sketsa manual sampai file 3D siap cetak.', 'https://images.unsplash.com/photo-1764737740462-2a310c7b2c39?w=1200&q=80&auto=format&fit=crop', 4),
  ('Display Musiman dan Dekorasi', 'Miniatur', 'Cetak tematik untuk kebutuhan dekorasi dan display musiman.', 'https://images.unsplash.com/photo-1767498051845-f04c53089e91?w=1200&q=80&auto=format&fit=crop', 5),
  ('Workstation Desain dan Cetak', 'Prototype', 'Alur kerja dari desain di layar sampai hasil cetak fisik yang siap dirapikan.', 'https://images.unsplash.com/photo-1563520239648-a24e51d4b570?w=1200&q=80&auto=format&fit=crop', 6);

-- ============================================================
-- 5. Promote your own admin account
-- ============================================================
-- After you register your first account through the site (email/password
-- or Google), run this once (replace the email) to make it an admin:
--
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');

# 3Dridens

Platform bisnis untuk 3D design & print: konsultasi, chat, penawaran harga, pembayaran DP/full via Midtrans, tracking progress produksi dengan foto, dan nota — dibangun dengan Next.js App Router + Supabase.

Semua fitur di bawah **sudah selesai dari sisi kode**. Yang tersisa hanya mengisi kredensial (Supabase, Google OAuth, Midtrans) — lihat langkah-langkah di bawah.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Tanpa konfigurasi Supabase, halaman publik (beranda, portfolio, testimoni) tetap jalan dengan data contoh — tapi login/register/dashboard/admin belum berfungsi sampai langkah di bawah selesai.

## Checklist setup (urutkan seperti ini)

### 1. Supabase (wajib — auth, database, storage)

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan file migrasi berikut **satu per satu, berurutan**:
   - [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) — `profiles`, `testimonials`, `portfolio_items`, role trigger, RLS, data contoh
   - [`supabase/migrations/0002_consultations_orders.sql`](supabase/migrations/0002_consultations_orders.sql) — `consultations`, `consultation_messages`, `orders`, generator nomor order
   - [`supabase/migrations/0003_payments.sql`](supabase/migrations/0003_payments.sql) — `payments`
   - [`supabase/migrations/0004_progress_updates.sql`](supabase/migrations/0004_progress_updates.sql) — `progress_updates` + bucket Storage privat `order-progress`
3. Salin `.env.example` menjadi `.env.local`, isi dari **Project Settings > API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only, jangan pernah expose ke browser atau commit)
4. Google login: **Authentication > Providers > Google** di Supabase, aktifkan, isi Client ID & Secret dari [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (OAuth Client ID tipe "Web application", redirect URI `https://<project-ref>.supabase.co/auth/v1/callback`).
5. Daftar akun pertama lewat `/register`, lalu jadikan admin lewat SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'email-kamu@contoh.com');
   ```
6. Restart `npm run dev`.

### 2. Midtrans (wajib — pembayaran DP/full/pelunasan)

1. Daftar/masuk ke [dashboard.midtrans.com](https://dashboard.midtrans.com), pakai mode **Sandbox** dulu.
2. **Settings > Access Keys**, isi ke `.env.local`:
   - `MIDTRANS_SERVER_KEY`
   - `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`
   - `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false` (ganti `true` hanya setelah pindah ke key Production)
3. Setelah deploy (lihat bagian Vercel di bawah), buka **Settings > Configuration** di Midtrans, isi **Payment Notification URL** dengan `https://<domain-kamu>/api/midtrans/webhook`. Tanpa ini status pembayaran tidak pernah ter-update otomatis.

### 3. Konten (opsional, sudah ada contoh)

Portfolio dan testimoni sudah terisi data contoh dari migrasi. Admin bisa tambah/edit/hapus/sembunyikan langsung dari `/admin/portfolio` dan `/admin/testimonials` setelah login sebagai admin.

## Alur bisnis yang sudah jadi

1. Customer daftar/masuk → ajukan konsultasi di `/consultation/new`.
2. Admin membalas via chat di halaman konsultasi, lalu membuat penawaran harga → otomatis jadi order.
3. Customer bayar DP atau penuh lewat Midtrans Snap di halaman order. Skema DP akan minta transaksi kedua (pelunasan) setelah produksi.
4. Admin upload foto + catatan progress di setiap tahap (`konsultasi → estimasi → pembayaran → desain → produksi → finishing → qc_kirim`) — customer melihatnya real-time di halaman order yang sama.
5. Sebelum "Tandai Dikirim", sistem mengecek order sudah lunas (`amount_paid >= total_amount`) — tidak bisa dilewati dari UI maupun langsung dari server action.
6. Nota otomatis tersedia di `/order/[id]/invoice`, siap dicetak/disimpan sebagai PDF lewat dialog print browser.

## Deploy ke Vercel

1. Push repo ini ke GitHub.
2. Import project di [vercel.com/new](https://vercel.com/new).
3. Tambahkan semua environment variables dari `.env.local` di Vercel Project Settings > Environment Variables.
4. Deploy, lalu daftarkan `https://<domain>/api/midtrans/webhook` di dashboard Midtrans (lihat langkah Midtrans #3 di atas).
5. Setelah siap live: ganti key Midtrans ke Production dan set `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true`.

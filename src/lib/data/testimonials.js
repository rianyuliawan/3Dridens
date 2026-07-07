import { createClient } from "@/lib/supabase/server";

// Mirrors the seed rows in supabase/migrations/0001_init.sql. Used as a
// fallback so /testimoni still renders before Supabase credentials are
// configured, or if the query fails for any reason.
export const FALLBACK_TESTIMONIALS = [
  {
    id: "fallback-1",
    customer_name: "Raka Pratama",
    role_or_context: "Pemilik brand aksesoris custom",
    quote:
      "Prosesnya jelas dari awal sampai akhir. Update progress dikirim rutin jadi saya tidak perlu tanya-tanya terus.",
    rating: 5,
  },
  {
    id: "fallback-2",
    customer_name: "Dinda Amelia",
    role_or_context: "Mahasiswa Desain Produk",
    quote:
      "Bantuan desainnya sangat membantu, model saya yang awalnya susah dicetak jadi bisa disesuaikan tanpa mengubah bentuk aslinya.",
    rating: 5,
  },
  {
    id: "fallback-3",
    customer_name: "Bagus Setiawan",
    role_or_context: "Founder startup IoT",
    quote:
      "Hasil cetak presisi untuk enclosure sensor kami. Toleransi ukurannya pas, tidak perlu revisi berkali-kali.",
    rating: 4,
  },
  {
    id: "fallback-4",
    customer_name: "Sari Wulandari",
    role_or_context: "Content creator",
    quote:
      "Suka banget sama hasil finishing-nya, halus dan warnanya sesuai referensi yang saya kirim.",
    rating: 5,
  },
];

export async function getTestimonials() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return FALLBACK_TESTIMONIALS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, customer_name, role_or_context, quote, rating")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return FALLBACK_TESTIMONIALS;
    }

    return data;
  } catch {
    return FALLBACK_TESTIMONIALS;
  }
}

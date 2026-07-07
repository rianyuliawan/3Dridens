import { createClient } from "@/lib/supabase/server";

// Mirrors the seed rows in supabase/migrations/0001_init.sql. Used as a
// fallback so /portfolio still renders before Supabase credentials are
// configured, or if the query fails for any reason.
export const FALLBACK_PORTFOLIO_ITEMS = [
  {
    id: "fallback-1",
    title: "Prototype Cetak 3D Custom",
    category: "Prototype",
    description:
      "Cetak prototype presisi langsung dari mesin FDM untuk kebutuhan pengujian bentuk dan fungsi.",
    image_url:
      "https://images.unsplash.com/photo-1702863361902-93c51bfbd923?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "fallback-2",
    title: "Miniatur Figurin Detail Tinggi",
    category: "Miniatur",
    description:
      "Figurin dan miniatur dengan detail halus, cocok untuk koleksi maupun hadiah custom.",
    image_url:
      "https://images.unsplash.com/photo-1781027237929-ee1b0448c812?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "fallback-3",
    title: "Part Fungsional Presisi",
    category: "Fungsional",
    description:
      "Komponen fungsional dengan toleransi ketat untuk kebutuhan perakitan dan mekanikal.",
    image_url:
      "https://images.unsplash.com/photo-1611505982706-9ebc79e5d3f1?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "fallback-4",
    title: "Proses Desain dari Sketsa",
    category: "Desain Custom",
    description:
      "Kolaborasi desain mulai dari sketsa manual sampai file 3D siap cetak.",
    image_url:
      "https://images.unsplash.com/photo-1764737740462-2a310c7b2c39?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "fallback-5",
    title: "Display Musiman dan Dekorasi",
    category: "Miniatur",
    description: "Cetak tematik untuk kebutuhan dekorasi dan display musiman.",
    image_url:
      "https://images.unsplash.com/photo-1767498051845-f04c53089e91?w=1200&q=80&auto=format&fit=crop",
  },
  {
    id: "fallback-6",
    title: "Workstation Desain dan Cetak",
    category: "Prototype",
    description:
      "Alur kerja dari desain di layar sampai hasil cetak fisik yang siap dirapikan.",
    image_url:
      "https://images.unsplash.com/photo-1563520239648-a24e51d4b570?w=1200&q=80&auto=format&fit=crop",
  },
];

export async function getPortfolioItems() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return FALLBACK_PORTFOLIO_ITEMS;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("id, title, category, description, image_url")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return FALLBACK_PORTFOLIO_ITEMS;
    }

    return data;
  } catch {
    return FALLBACK_PORTFOLIO_ITEMS;
  }
}

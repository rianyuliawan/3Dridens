"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

const itemSchema = z.object({
  title: z.string().trim().min(3, "Judul minimal 3 karakter."),
  category: z.string().trim().optional(),
  description: z.string().trim().optional(),
  imageUrl: z.string().trim().url("URL gambar tidak valid."),
  sortOrder: z.coerce.number().int().optional(),
});

export async function createPortfolioItemAction(_prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa menambah portfolio." };

  const parsed = itemSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { error } = await supabase.from("portfolio_items").insert({
    title: parsed.data.title,
    category: parsed.data.category || null,
    description: parsed.data.description || null,
    image_url: parsed.data.imageUrl,
    sort_order: parsed.data.sortOrder || 0,
  });

  if (error) return { error: "Gagal menambah portfolio." };

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function updatePortfolioItemAction(itemId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa mengubah portfolio." };

  const parsed = itemSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    sortOrder: formData.get("sortOrder") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { error } = await supabase
    .from("portfolio_items")
    .update({
      title: parsed.data.title,
      category: parsed.data.category || null,
      description: parsed.data.description || null,
      image_url: parsed.data.imageUrl,
      sort_order: parsed.data.sortOrder || 0,
    })
    .eq("id", itemId);

  if (error) return { error: "Gagal menyimpan perubahan." };

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
  redirect("/admin/portfolio");
}

export async function togglePortfolioPublishedAction(itemId, currentValue) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return;

  await supabase
    .from("portfolio_items")
    .update({ is_published: !currentValue })
    .eq("id", itemId);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function deletePortfolioItemAction(itemId) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return;

  await supabase.from("portfolio_items").delete().eq("id", itemId);

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

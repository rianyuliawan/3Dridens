"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

const testimonialSchema = z.object({
  customerName: z.string().trim().min(2, "Nama minimal 2 karakter."),
  roleOrContext: z.string().trim().optional(),
  quote: z.string().trim().min(10, "Testimoni minimal 10 karakter."),
  rating: z.coerce.number().int().min(1).max(5),
});

export async function createTestimonialAction(_prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa menambah testimoni." };

  const parsed = testimonialSchema.safeParse({
    customerName: formData.get("customerName"),
    roleOrContext: formData.get("roleOrContext"),
    quote: formData.get("quote"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { error } = await supabase.from("testimonials").insert({
    customer_name: parsed.data.customerName,
    role_or_context: parsed.data.roleOrContext || null,
    quote: parsed.data.quote,
    rating: parsed.data.rating,
  });

  if (error) return { error: "Gagal menambah testimoni." };

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimoni");
  redirect("/admin/testimonials");
}

export async function updateTestimonialAction(testimonialId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa mengubah testimoni." };

  const parsed = testimonialSchema.safeParse({
    customerName: formData.get("customerName"),
    roleOrContext: formData.get("roleOrContext"),
    quote: formData.get("quote"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { error } = await supabase
    .from("testimonials")
    .update({
      customer_name: parsed.data.customerName,
      role_or_context: parsed.data.roleOrContext || null,
      quote: parsed.data.quote,
      rating: parsed.data.rating,
    })
    .eq("id", testimonialId);

  if (error) return { error: "Gagal menyimpan perubahan." };

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimoni");
  redirect("/admin/testimonials");
}

export async function toggleTestimonialPublishedAction(testimonialId, currentValue) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return;

  await supabase
    .from("testimonials")
    .update({ is_published: !currentValue })
    .eq("id", testimonialId);

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimoni");
}

export async function deleteTestimonialAction(testimonialId) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return;

  await supabase.from("testimonials").delete().eq("id", testimonialId);

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimoni");
}

"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

const updatePricingSchema = z.object({
  designFee: z.coerce.number().min(0),
  printingFee: z.coerce.number().min(0),
  finishingFee: z.coerce.number().min(0),
  shippingFee: z.coerce.number().min(0),
  paymentScheme: z.enum(["dp", "full"]),
  dpPercent: z.coerce.number().int().min(1).max(99),
  material: z.string().trim().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  adminNote: z.string().trim().optional(),
  currentStage: z.enum([
    "konsultasi",
    "estimasi",
    "pembayaran",
    "desain",
    "produksi",
    "finishing",
    "qc_kirim",
  ]),
});

export async function updateOrderPricingAction(orderId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa mengubah order." };

  const parsed = updatePricingSchema.safeParse({
    designFee: formData.get("designFee"),
    printingFee: formData.get("printingFee"),
    finishingFee: formData.get("finishingFee"),
    shippingFee: formData.get("shippingFee"),
    paymentScheme: formData.get("paymentScheme"),
    dpPercent: formData.get("dpPercent"),
    material: formData.get("material"),
    quantity: formData.get("quantity") || undefined,
    adminNote: formData.get("adminNote"),
    currentStage: formData.get("currentStage"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      design_fee: parsed.data.designFee,
      printing_fee: parsed.data.printingFee,
      finishing_fee: parsed.data.finishingFee,
      shipping_fee: parsed.data.shippingFee,
      payment_scheme: parsed.data.paymentScheme,
      dp_percent: parsed.data.dpPercent,
      material: parsed.data.material || null,
      quantity: parsed.data.quantity || null,
      admin_note: parsed.data.adminNote || null,
      current_stage: parsed.data.currentStage,
    })
    .eq("id", orderId);

  if (error) {
    return { error: "Gagal menyimpan perubahan order." };
  }

  revalidatePath(`/order/${orderId}`);
  return { error: null };
}

export async function markShippedAction(orderId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa menandai pengiriman." };

  const trackingNumber = formData.get("trackingNumber")?.toString().trim();
  if (!trackingNumber) {
    return { error: "Nomor resi wajib diisi." };
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("total_amount, amount_paid")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { error: "Order tidak ditemukan." };
  }

  if (Number(order.amount_paid) < Number(order.total_amount)) {
    return {
      error:
        "Order belum lunas. Pastikan pembayaran penuh diterima sebelum menandai pengiriman.",
    };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      current_stage: "qc_kirim",
      tracking_number: trackingNumber,
      shipped_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { error: "Gagal menandai pengiriman." };
  }

  revalidatePath(`/order/${orderId}`);
  return { error: null };
}

export async function markCompletedAction(orderId) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa menyelesaikan order." };

  const { error } = await supabase
    .from("orders")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", orderId);

  if (error) {
    return { error: "Gagal menyelesaikan order." };
  }

  revalidatePath(`/order/${orderId}`);
  return { error: null };
}

export async function cancelOrderAction(orderId) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa membatalkan order." };

  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId);

  if (error) {
    return { error: "Gagal membatalkan order." };
  }

  revalidatePath(`/order/${orderId}`);
  return { error: null };
}

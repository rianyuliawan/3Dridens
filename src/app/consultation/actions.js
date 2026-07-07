"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";

const consultationSchema = z.object({
  type: z.enum(["design", "printing", "both"]),
  title: z.string().trim().min(3, "Judul minimal 3 karakter."),
  description: z.string().trim().optional(),
  materialPref: z.string().trim().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  deadline: z.string().optional(),
});

export async function createConsultationAction(_prevState, formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Kamu harus masuk dulu untuk mengajukan konsultasi." };
  }

  const parsed = consultationSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    materialPref: formData.get("materialPref"),
    quantity: formData.get("quantity") || undefined,
    deadline: formData.get("deadline") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const { data, error } = await supabase
    .from("consultations")
    .insert({
      customer_id: user.id,
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description || null,
      material_pref: parsed.data.materialPref || null,
      quantity: parsed.data.quantity || null,
      deadline: parsed.data.deadline || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: "Gagal mengirim konsultasi, coba lagi." };
  }

  redirect(`/consultation/${data.id}`);
}

export async function sendMessageAction(consultationId, _prevState, formData) {
  const body = formData.get("body")?.toString().trim();
  if (!body) {
    return { error: "Pesan tidak boleh kosong." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi kamu berakhir, silakan masuk lagi." };
  }

  const { error } = await supabase.from("consultation_messages").insert({
    consultation_id: consultationId,
    sender_id: user.id,
    body,
  });

  if (error) {
    return { error: "Gagal mengirim pesan." };
  }

  revalidatePath(`/consultation/${consultationId}`);
  return { error: null };
}

export async function updateConsultationStatusAction(consultationId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa mengubah status." };

  const status = formData.get("status")?.toString();
  const allowed = ["new", "discussing", "quoted", "converted", "declined"];
  if (!allowed.includes(status)) {
    return { error: "Status tidak valid." };
  }

  await supabase.from("consultations").update({ status }).eq("id", consultationId);
  revalidatePath(`/consultation/${consultationId}`);
  return { error: null };
}

const convertSchema = z.object({
  designFee: z.coerce.number().min(0),
  printingFee: z.coerce.number().min(0),
  finishingFee: z.coerce.number().min(0),
  shippingFee: z.coerce.number().min(0),
  paymentScheme: z.enum(["dp", "full"]),
  dpPercent: z.coerce.number().int().min(1).max(99),
  material: z.string().trim().optional(),
  quantity: z.coerce.number().int().positive().optional(),
  adminNote: z.string().trim().optional(),
});

export async function convertToOrderAction(consultationId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa membuat order." };

  const parsed = convertSchema.safeParse({
    designFee: formData.get("designFee"),
    printingFee: formData.get("printingFee"),
    finishingFee: formData.get("finishingFee"),
    shippingFee: formData.get("shippingFee"),
    paymentScheme: formData.get("paymentScheme"),
    dpPercent: formData.get("dpPercent"),
    material: formData.get("material"),
    quantity: formData.get("quantity") || undefined,
    adminNote: formData.get("adminNote"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data harga tidak valid." };
  }

  const { data: consultation, error: consultationError } = await supabase
    .from("consultations")
    .select("customer_id")
    .eq("id", consultationId)
    .single();

  if (consultationError || !consultation) {
    return { error: "Konsultasi tidak ditemukan." };
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      consultation_id: consultationId,
      customer_id: consultation.customer_id,
      design_fee: parsed.data.designFee,
      printing_fee: parsed.data.printingFee,
      finishing_fee: parsed.data.finishingFee,
      shipping_fee: parsed.data.shippingFee,
      payment_scheme: parsed.data.paymentScheme,
      dp_percent: parsed.data.dpPercent,
      material: parsed.data.material || null,
      quantity: parsed.data.quantity || null,
      admin_note: parsed.data.adminNote || null,
      current_stage: "estimasi",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "Gagal membuat order." };
  }

  await supabase
    .from("consultations")
    .update({ status: "converted" })
    .eq("id", consultationId);

  redirect(`/order/${order.id}`);
}

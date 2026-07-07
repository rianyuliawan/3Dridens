"use server";

import { revalidatePath } from "next/cache";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/admin-guard";
import { uploadProgressPhotos } from "@/lib/storage";

const STAGES = [
  "konsultasi",
  "estimasi",
  "pembayaran",
  "desain",
  "produksi",
  "finishing",
  "qc_kirim",
];

export async function addProgressUpdateAction(orderId, _prevState, formData) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return { error: "Hanya admin yang bisa menambah update progress." };

  const stage = formData.get("stage")?.toString();
  if (!STAGES.includes(stage)) {
    return { error: "Tahap tidak valid." };
  }

  const note = formData.get("note")?.toString().trim() || null;
  const files = formData.getAll("photos").filter((file) => file instanceof File && file.size > 0);

  const progressUpdateId = crypto.randomUUID();
  const photoPaths = files.length > 0 ? await uploadProgressPhotos(orderId, progressUpdateId, files) : [];

  const serviceClient = createServiceRoleClient();
  const { error: insertError } = await serviceClient.from("progress_updates").insert({
    id: progressUpdateId,
    order_id: orderId,
    stage,
    note,
    photo_paths: photoPaths,
    created_by: admin.id,
  });

  if (insertError) {
    return { error: "Gagal menyimpan update progress." };
  }

  await serviceClient.from("orders").update({ current_stage: stage }).eq("id", orderId);

  revalidatePath(`/order/${orderId}`);
  return { error: null };
}

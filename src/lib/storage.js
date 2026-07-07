import { createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = "order-progress";
const SIGNED_URL_TTL_SECONDS = 60 * 10;

// Bucket is fully private — signed URLs are always minted here, server-side,
// after the caller (page.js) has already confirmed the requesting user owns
// the order or is admin. Never expose this bucket via a public/select policy.
export async function getSignedPhotoUrls(paths) {
  if (!paths || paths.length === 0) return [];

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

  if (error || !data) return [];
  return data.map((item) => item.signedUrl).filter(Boolean);
}

export async function uploadProgressPhotos(orderId, progressUpdateId, files) {
  const supabase = createServiceRoleClient();
  const paths = [];

  for (const file of files) {
    if (!file || file.size === 0) continue;
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${orderId}/${progressUpdateId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type || "application/octet-stream",
    });

    if (!error) paths.push(path);
  }

  return paths;
}

import { createClient } from "@/lib/supabase/server";

// Authoritative (DB-backed) session + role lookup for Server Components,
// layouts, and Server Actions. Always prefer this over trusting only the
// middleware's JWT-claim check for anything privileged.
export async function getSessionProfile() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { user: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, avatar_url")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

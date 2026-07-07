// Shared by Server Actions that need to verify the caller is an admin before
// running a privileged write. Always re-checked against the DB, not trusted
// from a client-supplied value or JWT claim alone.
export async function requireAdmin(supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}

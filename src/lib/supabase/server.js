import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// RLS-respecting client for Server Components / Server Actions / Route Handlers.
// Reads/writes the user's session cookie so `auth.uid()` resolves correctly in policies.
export async function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Every caller of this client needs a real session/query to do anything
    // useful — before Supabase is configured, send them to /login instead of
    // throwing an opaque "URL and Key are required" error.
    redirect("/login");
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component (not an Action/Route Handler) — the
            // middleware already refreshes the session, so this can be ignored.
          }
        },
      },
    }
  );
}

// Service-role client — bypasses RLS entirely. Server-only, never import this
// into a "use client" file or a bundle that ships to the browser. Used only for
// the Midtrans webhook and admin-verified privileged writes (later phases).
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}

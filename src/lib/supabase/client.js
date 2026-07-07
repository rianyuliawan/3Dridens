"use client";

import { createBrowserClient } from "@supabase/ssr";

// Browser client for the few client components that need direct Supabase
// access (Google OAuth redirect button, Snap.js payment flow later on).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

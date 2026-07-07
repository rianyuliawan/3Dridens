import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const ADMIN_PREFIX = "/admin";
const AUTHED_PREFIXES = ["/dashboard", "/order", "/consultation"];

// Refreshes the Supabase session cookie on every request and coarsely gates
// role-restricted routes. Pages/Server Actions still re-check role against
// the DB before any privileged read/write (defense in depth).
export async function updateSession(request) {
  let response = NextResponse.next({ request });

  // Supabase isn't configured yet (no .env.local) — let the site run in a
  // "logged out" state instead of crashing every request. Auth-gated pages
  // will still redirect once Supabase env vars are added.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const needsAuth =
    pathname.startsWith(ADMIN_PREFIX) ||
    AUTHED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (needsAuth && !user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && user) {
    const role = user.app_metadata?.role ?? user.user_metadata?.role;
    // Custom claim isn't configured yet (requires a Supabase Auth Hook) — when
    // absent, fall through and let the /admin layout do the authoritative
    // DB-backed role check instead of blocking here.
    if (role && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

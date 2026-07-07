"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("Email tidak valid."),
  password: z.string().min(1, "Password wajib diisi."),
  next: z.string().optional(),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter."),
  email: z.string().trim().email("Email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter."),
});

async function roleHomePath(supabase, userId) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  return profile?.role === "admin" ? "/admin" : "/dashboard";
}

function assertSupabaseConfigured() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return "Supabase belum dikonfigurasi di server ini. Hubungi admin.";
  }
  return null;
}

export async function loginAction(_prevState, formData) {
  const configError = assertSupabaseConfigured();
  if (configError) return { error: configError };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: "Email atau password salah." };
  }

  const destination = parsed.data.next || (await roleHomePath(supabase, data.user.id));
  redirect(destination);
}

export async function registerAction(_prevState, formData) {
  const configError = assertSupabaseConfigured();
  if (configError) return { error: configError };

  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
    },
  });

  if (error) {
    return { error: error.message.includes("already registered")
      ? "Email ini sudah terdaftar."
      : "Registrasi gagal, coba lagi." };
  }

  if (!data.session) {
    return {
      success:
        "Akun berhasil dibuat. Silakan cek email kamu untuk konfirmasi sebelum login.",
    };
  }

  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

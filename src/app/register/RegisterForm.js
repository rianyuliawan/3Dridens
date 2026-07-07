"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/auth/actions";
import GoogleButton from "@/app/auth/GoogleButton";

const initialState = { error: null, success: null };

export default function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <div className="auth-card">
      <div className="brand">
        <span>3D</span>
        <strong>3Dridens</strong>
      </div>
      <h1>Buat akun baru</h1>
      <p className="auth-sub">Daftar untuk mulai konsultasi project 3D printing kamu.</p>

      {state?.error ? <p className="auth-error">{state.error}</p> : null}
      {state?.success ? <p className="auth-success">{state.success}</p> : null}

      <form action={formAction} className="auth-form">
        <label>
          <span>Nama lengkap</span>
          <input autoComplete="name" name="fullName" required type="text" />
        </label>
        <label>
          <span>Email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          <span>Password</span>
          <input autoComplete="new-password" minLength={6} name="password" required type="password" />
        </label>
        <button disabled={pending} type="submit">
          {pending ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <div className="auth-divider">
        <span>atau</span>
      </div>

      <GoogleButton />

      <p className="auth-footer">
        Sudah punya akun? <Link href="/login">Masuk di sini</Link>
      </p>
    </div>
  );
}

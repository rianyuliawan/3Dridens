"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/auth/actions";
import GoogleButton from "@/app/auth/GoogleButton";

const initialState = { error: null };

export default function LoginForm({ next }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="auth-card">
      <div className="brand">
        <span>3D</span>
        <strong>3Dridens</strong>
      </div>
      <h1>Masuk ke akun kamu</h1>
      <p className="auth-sub">Pantau konsultasi, pembayaran, dan progress order kamu.</p>

      {state?.error ? <p className="auth-error">{state.error}</p> : null}

      <form action={formAction} className="auth-form">
        <input name="next" type="hidden" value={next || ""} />
        <label>
          <span>Email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label>
          <span>Password</span>
          <input autoComplete="current-password" name="password" required type="password" />
        </label>
        <button disabled={pending} type="submit">
          {pending ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="auth-divider">
        <span>atau</span>
      </div>

      <GoogleButton next={next} />

      <p className="auth-footer">
        Belum punya akun? <Link href="/register">Daftar di sini</Link>
      </p>
    </div>
  );
}

"use client";

import { useActionState } from "react";

const initialState = { error: null };

export default function TestimonialForm({ action, defaultValues, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <article className="system-panel">
      {state?.error ? <p className="auth-error">{state.error}</p> : null}
      <form action={formAction} className="brief-grid">
        <label className="system-field">
          <span>Nama customer</span>
          <input defaultValue={defaultValues?.customerName || ""} name="customerName" required type="text" />
        </label>
        <label className="system-field">
          <span>Peran / konteks</span>
          <input
            defaultValue={defaultValues?.roleOrContext || ""}
            name="roleOrContext"
            placeholder="Contoh: Pemilik brand aksesoris"
            type="text"
          />
        </label>
        <label className="system-field">
          <span>Rating</span>
          <select defaultValue={defaultValues?.rating ?? 5} name="rating">
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} bintang
              </option>
            ))}
          </select>
        </label>
        <label className="system-field field-span-2">
          <span>Isi testimoni</span>
          <textarea defaultValue={defaultValues?.quote || ""} name="quote" required rows={4} />
        </label>
        <div className="form-actions field-span-2">
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? "Menyimpan..." : submitLabel}
          </button>
        </div>
      </form>
    </article>
  );
}

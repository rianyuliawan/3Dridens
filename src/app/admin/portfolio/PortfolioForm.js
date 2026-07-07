"use client";

import { useActionState } from "react";

const initialState = { error: null };

export default function PortfolioForm({ action, defaultValues, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <article className="system-panel">
      {state?.error ? <p className="auth-error">{state.error}</p> : null}
      <form action={formAction} className="brief-grid">
        <label className="system-field">
          <span>Judul</span>
          <input defaultValue={defaultValues?.title || ""} name="title" required type="text" />
        </label>
        <label className="system-field">
          <span>Kategori</span>
          <input
            defaultValue={defaultValues?.category || ""}
            name="category"
            placeholder="Prototype, Miniatur, Fungsional, dll."
            type="text"
          />
        </label>
        <label className="system-field">
          <span>Urutan tampil</span>
          <input defaultValue={defaultValues?.sortOrder ?? 0} min="0" name="sortOrder" type="number" />
        </label>
        <label className="system-field field-span-2">
          <span>URL gambar</span>
          <input
            defaultValue={defaultValues?.imageUrl || ""}
            name="imageUrl"
            placeholder="https://..."
            required
            type="url"
          />
        </label>
        <label className="system-field field-span-2">
          <span>Deskripsi</span>
          <textarea defaultValue={defaultValues?.description || ""} name="description" rows={3} />
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

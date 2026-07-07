"use client";

import { useActionState } from "react";
import { createConsultationAction } from "@/app/consultation/actions";

const initialState = { error: null };

export default function ConsultationForm() {
  const [state, formAction, pending] = useActionState(
    createConsultationAction,
    initialState
  );

  return (
    <article className="system-panel system-panel-wide">
      <div className="panel-heading">
        <span>01</span>
        <div>
          <h2>Ceritakan kebutuhan project kamu</h2>
          <p>Admin akan meninjau dan membalas lewat halaman ini.</p>
        </div>
      </div>

      {state?.error ? <p className="auth-error">{state.error}</p> : null}

      <form action={formAction} className="brief-grid">
        <label className="system-field">
          <span>Jenis kebutuhan</span>
          <select defaultValue="both" name="type" required>
            <option value="design">Bantuan desain</option>
            <option value="printing">Cetak 3D saja</option>
            <option value="both">Desain + cetak</option>
          </select>
        </label>
        <label className="system-field">
          <span>Judul project</span>
          <input name="title" placeholder="Contoh: Casing sensor IoT" required type="text" />
        </label>
        <label className="system-field">
          <span>Preferensi material</span>
          <input name="materialPref" placeholder="PLA, PETG, TPU, atau belum tahu" type="text" />
        </label>
        <label className="system-field">
          <span>Jumlah</span>
          <input min="1" name="quantity" type="number" />
        </label>
        <label className="system-field">
          <span>Target selesai</span>
          <input name="deadline" type="date" />
        </label>
        <label className="system-field field-span-2">
          <span>Detail project</span>
          <textarea
            name="description"
            placeholder="Ukuran, fungsi part, referensi bentuk, link file, dll."
            rows={5}
          />
        </label>
        <div className="form-actions field-span-2">
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? "Mengirim..." : "Kirim Konsultasi"}
          </button>
        </div>
      </form>
    </article>
  );
}

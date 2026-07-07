"use client";

import { useActionState } from "react";
import { addProgressUpdateAction } from "./progress-actions";

const initialState = { error: null };

const STAGE_OPTIONS = [
  { value: "konsultasi", label: "Konsultasi" },
  { value: "estimasi", label: "Estimasi" },
  { value: "pembayaran", label: "Pembayaran" },
  { value: "desain", label: "Desain" },
  { value: "produksi", label: "Produksi" },
  { value: "finishing", label: "Finishing" },
  { value: "qc_kirim", label: "QC & Kirim" },
];

export default function ProgressForm({ orderId, currentStage }) {
  const action = addProgressUpdateAction.bind(null, orderId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <article className="system-panel" id="progress">
      <div className="panel-heading">
        <span>+</span>
        <div>
          <h2>Tambah update progress</h2>
          <p>Upload foto dan catatan agar customer tahu posisi order.</p>
        </div>
      </div>

      {state?.error ? <p className="auth-error">{state.error}</p> : null}

      <form action={formAction} className="upload-dropzone-form">
        <label className="system-field">
          <span>Tahap</span>
          <select defaultValue={currentStage} name="stage" required>
            {STAGE_OPTIONS.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </label>
        <label className="system-field">
          <span>Catatan</span>
          <textarea name="note" placeholder="Contoh: sanding selesai, lanjut painting." rows={3} />
        </label>
        <label className="system-field">
          <span>Foto (bisa lebih dari satu)</span>
          <input accept="image/*" multiple name="photos" type="file" />
        </label>
        <div className="form-actions">
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? "Mengunggah..." : "Simpan Update"}
          </button>
        </div>
      </form>
    </article>
  );
}

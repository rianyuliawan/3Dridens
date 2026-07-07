"use client";

import { useActionState } from "react";
import { updateConsultationStatusAction } from "@/app/consultation/actions";

const initialState = { error: null };
const STATUS_OPTIONS = [
  { value: "new", label: "Baru" },
  { value: "discussing", label: "Sedang dibahas" },
  { value: "quoted", label: "Sudah ditawar harga" },
  { value: "declined", label: "Ditolak" },
];

export default function StatusForm({ consultationId, currentStatus }) {
  const action = updateConsultationStatusAction.bind(null, consultationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="system-field">
      <span>Status konsultasi</span>
      <div className="form-actions">
        <select defaultValue={currentStatus} name="status">
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="secondary-button" disabled={pending} type="submit">
          {pending ? "Menyimpan..." : "Update Status"}
        </button>
      </div>
      {state?.error ? <p className="auth-error">{state.error}</p> : null}
    </form>
  );
}

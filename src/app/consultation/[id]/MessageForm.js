"use client";

import { useActionState } from "react";
import { sendMessageAction } from "@/app/consultation/actions";

const initialState = { error: null };

export default function MessageForm({ consultationId }) {
  const action = sendMessageAction.bind(null, consultationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="chat-form">
      {state?.error ? <p className="auth-error">{state.error}</p> : null}
      <label className="system-field">
        <span>Tulis pesan</span>
        <textarea name="body" placeholder="Tulis balasan atau pertanyaan..." required rows={3} />
      </label>
      <div className="form-actions">
        <button className="primary-button" disabled={pending} type="submit">
          {pending ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </div>
    </form>
  );
}

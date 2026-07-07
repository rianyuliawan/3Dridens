"use client";

import { useActionState, useEffect, useState } from "react";
import Script from "next/script";
import { createPaymentAction } from "./payment-actions";

const initialState = { error: null, token: null };

const SNAP_SRC =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

const PURPOSE_LABEL = { dp: "Bayar DP", full: "Bayar Penuh", pelunasan: "Bayar Pelunasan" };

export default function PaymentButton({ orderId, purpose, amount }) {
  const action = createPaymentAction.bind(null, orderId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [snapReady, setSnapReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    if (!state.token || !snapReady || typeof window === "undefined" || !window.snap) return;

    window.snap.pay(state.token, {
      onSuccess: () => setPaymentStatus("success"),
      onPending: () => setPaymentStatus("pending"),
      onError: () => setPaymentStatus("error"),
      onClose: () => setPaymentStatus((current) => current || "closed"),
    });
  }, [state.token, snapReady]);

  const rupiah = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(amount);

  return (
    <div className="system-field">
      <Script
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        onReady={() => setSnapReady(true)}
        src={SNAP_SRC}
        strategy="afterInteractive"
      />
      {state.error ? <p className="auth-error">{state.error}</p> : null}
      {paymentStatus === "success" || paymentStatus === "pending" ? (
        <p className="auth-success">
          Pembayaran dikirim ke Midtrans. Refresh halaman ini setelah beberapa
          saat untuk melihat status terbaru.
        </p>
      ) : (
        <form action={formAction}>
          <button className="primary-button" disabled={pending || !snapReady} type="submit">
            {pending ? "Menyiapkan pembayaran..." : `${PURPOSE_LABEL[purpose]} · ${rupiah}`}
          </button>
        </form>
      )}
    </div>
  );
}

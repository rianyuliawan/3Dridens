"use client";

import { useActionState } from "react";
import { markShippedAction, markCompletedAction, cancelOrderAction } from "@/app/order/actions";

const initialState = { error: null };

export default function ShippingForm({ order }) {
  const shipAction = markShippedAction.bind(null, order.id);
  const [shipState, shipFormAction, shipPending] = useActionState(shipAction, initialState);

  async function handleComplete() {
    await markCompletedAction(order.id);
  }

  async function handleCancel() {
    await cancelOrderAction(order.id);
  }

  return (
    <article className="system-panel" id="pengiriman">
      <div className="panel-heading">
        <span>03</span>
        <div>
          <h2>Pengiriman & penyelesaian</h2>
          <p>Pastikan order sudah lunas sebelum menandai dikirim.</p>
        </div>
      </div>

      {shipState?.error ? <p className="auth-error">{shipState.error}</p> : null}

      {order.status === "shipped" || order.status === "completed" ? (
        <p>
          Resi: <strong>{order.tracking_number}</strong>
        </p>
      ) : (
        <form action={shipFormAction} className="shipping-row">
          <label className="system-field">
            <span>Nomor resi</span>
            <input name="trackingNumber" placeholder="Contoh: JNE1234567890" required type="text" />
          </label>
          <button className="primary-button" disabled={shipPending} type="submit">
            {shipPending ? "Menyimpan..." : "Tandai Dikirim"}
          </button>
        </form>
      )}

      <div className="form-actions">
        {order.status === "shipped" ? (
          <form action={handleComplete}>
            <button className="secondary-button" type="submit">
              Tandai Selesai
            </button>
          </form>
        ) : null}
        {order.status !== "completed" && order.status !== "cancelled" ? (
          <form action={handleCancel}>
            <button className="ghost-button" type="submit">
              Batalkan Order
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}

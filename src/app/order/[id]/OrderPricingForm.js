"use client";

import { useActionState } from "react";
import { updateOrderPricingAction } from "@/app/order/actions";

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

export default function OrderPricingForm({ order }) {
  const action = updateOrderPricingAction.bind(null, order.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <article className="system-panel" id="estimasi">
      <div className="panel-heading">
        <span>02</span>
        <div>
          <h2>Edit order (admin)</h2>
          <p>Perubahan langsung memperbarui invoice customer.</p>
        </div>
      </div>

      {state?.error ? <p className="auth-error">{state.error}</p> : null}

      <form action={formAction} className="price-fields">
        <label className="system-field">
          <span>Desain</span>
          <div>
            <small>Rp</small>
            <input defaultValue={order.design_fee} min="0" name="designFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Cetak</span>
          <div>
            <small>Rp</small>
            <input defaultValue={order.printing_fee} min="0" name="printingFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Finishing</span>
          <div>
            <small>Rp</small>
            <input defaultValue={order.finishing_fee} min="0" name="finishingFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Pengiriman</span>
          <div>
            <small>Rp</small>
            <input defaultValue={order.shipping_fee} min="0" name="shippingFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Skema pembayaran</span>
          <select defaultValue={order.payment_scheme} name="paymentScheme">
            <option value="full">Bayar penuh</option>
            <option value="dp">DP dulu</option>
          </select>
        </label>
        <label className="system-field">
          <span>Persentase DP</span>
          <div>
            <input defaultValue={order.dp_percent} max="99" min="1" name="dpPercent" type="number" />
            <small>%</small>
          </div>
        </label>
        <label className="system-field">
          <span>Material</span>
          <input defaultValue={order.material || ""} name="material" type="text" />
        </label>
        <label className="system-field">
          <span>Jumlah</span>
          <input defaultValue={order.quantity || 1} min="1" name="quantity" type="number" />
        </label>
        <label className="system-field">
          <span>Tahap produksi</span>
          <select defaultValue={order.current_stage} name="currentStage">
            {STAGE_OPTIONS.map((stage) => (
              <option key={stage.value} value={stage.value}>
                {stage.label}
              </option>
            ))}
          </select>
        </label>
        <label className="system-field field-span-2">
          <span>Catatan admin</span>
          <textarea defaultValue={order.admin_note || ""} name="adminNote" rows={3} />
        </label>
        <div className="form-actions field-span-2">
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </article>
  );
}

"use client";

import { useActionState } from "react";
import { convertToOrderAction } from "@/app/consultation/actions";

const initialState = { error: null };

export default function ConvertToOrderForm({ consultationId, defaultMaterial, defaultQuantity }) {
  const action = convertToOrderAction.bind(null, consultationId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <article className="system-panel" id="estimasi">
      <div className="panel-heading">
        <span>02</span>
        <div>
          <h2>Buat penawaran harga</h2>
          <p>Mengisi form ini akan membuat order baru untuk customer.</p>
        </div>
      </div>

      {state?.error ? <p className="auth-error">{state.error}</p> : null}

      <form action={formAction} className="price-fields">
        <label className="system-field">
          <span>Desain</span>
          <div>
            <small>Rp</small>
            <input defaultValue={0} min="0" name="designFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Cetak</span>
          <div>
            <small>Rp</small>
            <input defaultValue={0} min="0" name="printingFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Finishing</span>
          <div>
            <small>Rp</small>
            <input defaultValue={0} min="0" name="finishingFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Pengiriman</span>
          <div>
            <small>Rp</small>
            <input defaultValue={0} min="0" name="shippingFee" required type="number" />
          </div>
        </label>
        <label className="system-field">
          <span>Skema pembayaran</span>
          <select defaultValue="full" name="paymentScheme">
            <option value="full">Bayar penuh</option>
            <option value="dp">DP dulu</option>
          </select>
        </label>
        <label className="system-field">
          <span>Persentase DP</span>
          <div>
            <input defaultValue={50} max="99" min="1" name="dpPercent" type="number" />
            <small>%</small>
          </div>
        </label>
        <label className="system-field">
          <span>Material</span>
          <input defaultValue={defaultMaterial || ""} name="material" type="text" />
        </label>
        <label className="system-field">
          <span>Jumlah</span>
          <input defaultValue={defaultQuantity || 1} min="1" name="quantity" type="number" />
        </label>
        <label className="system-field field-span-2">
          <span>Catatan admin</span>
          <textarea name="adminNote" rows={3} />
        </label>
        <div className="form-actions field-span-2">
          <button className="primary-button" disabled={pending} type="submit">
            {pending ? "Membuat order..." : "Buat Order"}
          </button>
        </div>
      </form>
    </article>
  );
}

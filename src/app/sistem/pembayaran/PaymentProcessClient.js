"use client";

import { useMemo, useState } from "react";

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

const initialPayment = {
  orderId: "3DR-2607-014",
  customer: "Raka",
  project: "Prototype casing sensor IoT",
  paymentMode: "DP",
  total: 850000,
  paid: 425000,
  receipt:
    "Transfer BCA 1234567890 a.n. 3Dridens Studio, 2 Juli 2026 jam 14.20",
  status: "Menunggu konfirmasi",
  note:
    "DP 50% sudah masuk. Tunggu verifikasi bukti transfer sebelum cetak dimulai.",
};

const stages = [
  "Brief masuk dan admin cek kebutuhan",
  "Estimasi biaya selesai",
  "Pembayaran DP terkonfirmasi",
  "Produksi dan finishing berjalan",
  "QC, pelunasan, dan pengiriman",
];

export default function PaymentProcessClient() {
  const [payment, setPayment] = useState(initialPayment);

  const remaining = useMemo(() => payment.total - payment.paid, [payment]);
  const progress = useMemo(() => {
    if (payment.status.includes("Menunggu")) return 40;
    if (payment.status.includes("Lunas")) return 80;
    return 60;
  }, [payment.status]);

  const confirmPayment = () => {
    setPayment((current) => ({
      ...current,
      status: "Pembayaran terkonfirmasi",
      paid: current.total,
      note: "Pembayaran sudah terverifikasi. Order siap masuk produksi.",
    }));
  };

  return (
    <main className="site-shell">
      <section className="hero" id="top">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Admin Pembayaran</p>
          <h1>Proses pembayaran order dan konfirmasi bukti transfer.</h1>
          <p className="lead">
            Gunakan halaman ini untuk melihat detail invoice, menandai pembayaran DP atau
            full sebagai terkonfirmasi, dan melanjutkan alur produksi.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/sistem">
              Kembali ke Dashboard
            </a>
          </div>
          <div className="stats">
            <div>
              <strong>Status</strong>
              <span>{payment.status}</span>
            </div>
            <div>
              <strong>Pembayaran</strong>
              <span>{payment.paymentMode}</span>
            </div>
            <div>
              <strong>Sisa tagihan</strong>
              <span>{rupiah.format(remaining)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section services" id="invoice">
        <div className="section-heading">
          <p className="eyebrow">Ringkasan Order</p>
          <h2>Invoice dan bukti pembayaran.</h2>
        </div>
        <div className="service-grid reveal-grid">
          <article>
            <h3>Informasi order</h3>
            <p>Order ID: {payment.orderId}</p>
            <p>Customer: {payment.customer}</p>
            <p>Project: {payment.project}</p>
          </article>
          <article>
            <h3>Detail pembayaran</h3>
            <p>Total: {rupiah.format(payment.total)}</p>
            <p>Dibayar: {rupiah.format(payment.paid)}</p>
            <p>Sisa: {rupiah.format(remaining)}</p>
          </article>
          <article>
            <h3>Bukti transfer</h3>
            <p>{payment.receipt}</p>
          </article>
        </div>
      </section>

      <section className="section results" id="proses">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Alur pembayaran</p>
            <h2>Langkah progress dari konsultasi sampai produksi.</h2>
          </div>
          <p>
            Admin bisa memperbarui status pembayaran setelah bukti diterima agar
            tim produksi dapat melanjutkan pengerjaan.
          </p>
        </div>
        <div className="gallery-grid reveal-grid">
          {stages.map((stage, index) => (
            <article
              key={stage}
              className={index <= (payment.paid === payment.total ? 4 : 1) ? "active" : ""}
            >
              <span>0{index + 1}</span>
              <h3>{stage}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section services" id="action">
        <div className="section-heading">
          <p className="eyebrow">Tindakan admin</p>
          <h2>Verifikasi dan lanjutkan order.</h2>
        </div>
        <div className="service-grid reveal-grid">
          <article>
            <h3>Progress pembayaran</h3>
            <div className="progress-track">
              <i style={{ width: `${progress}%` }} />
            </div>
            <p>{progress}% selesai</p>
          </article>
          <article>
            <h3>Catatan</h3>
            <p>{payment.note}</p>
          </article>
          <article>
            <button className="primary-button" type="button" onClick={confirmPayment}>
              Konfirmasi Pembayaran
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}

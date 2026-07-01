"use client";

import { useMemo, useState } from "react";

const WHATSAPP_NUMBER = "6285691555890";

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

const initialQuote = {
  designFee: 85000,
  printingFee: 320000,
  finishingFee: 125000,
  shippingFee: 25000,
  dpPercent: 50,
};

const stages = [
  {
    label: "Konsultasi",
    detail: "Brief, ukuran, referensi, material, dan deadline sudah masuk.",
  },
  {
    label: "Estimasi",
    detail: "Admin mengunci biaya desain, cetak, finishing, dan pengiriman.",
  },
  {
    label: "Pembayaran",
    detail: "Customer memilih DP atau full payment lalu upload/konfirmasi bukti.",
  },
  {
    label: "Desain",
    detail: "File dicek, dimodelkan, atau dirapikan sampai siap slicing.",
  },
  {
    label: "Produksi",
    detail: "Mesin mencetak part dan admin update progres pengerjaan.",
  },
  {
    label: "Finishing",
    detail: "Sanding, primer, painting, atau perapihan detail sesuai request.",
  },
  {
    label: "QC & Kirim",
    detail: "Quality check, pelunasan jika DP, packing, lalu nomor resi dikirim.",
  },
];

function Field({ label, name, onChange, prefix, suffix, type = "number", value }) {
  return (
    <label className="system-field">
      <span>{label}</span>
      <div>
        {prefix ? <small>{prefix}</small> : null}
        <input min="0" name={name} onChange={onChange} type={type} value={value} />
        {suffix ? <small>{suffix}</small> : null}
      </div>
    </label>
  );
}

export default function WorkflowDashboard() {
  const [quote, setQuote] = useState(initialQuote);
  const [paymentMode, setPaymentMode] = useState("DP");
  const [currentStage, setCurrentStage] = useState(2);
  const [order, setOrder] = useState({
    customer: "Raka",
    project: "Prototype casing sensor IoT",
    material: "PETG",
    quantity: "2 pcs",
    deadline: "10 Juli 2026",
    adminNote:
      "Toleransi lubang baut dicek ulang. Warna hitam doff, finishing ringan.",
    receipt: "",
    tracking: "Belum dikirim",
  });

  const total = useMemo(() => {
    return (
      Number(quote.designFee) +
      Number(quote.printingFee) +
      Number(quote.finishingFee) +
      Number(quote.shippingFee)
    );
  }, [quote]);

  const dpAmount = Math.round((total * Number(quote.dpPercent)) / 100);
  const dueNow = paymentMode === "Full" ? total : dpAmount;
  const remaining = total - dueNow;
  const progress = Math.round(((currentStage + 1) / stages.length) * 100);

  const paymentMessage = [
    "Halo 3Dridens, saya mau konfirmasi pembayaran.",
    `Order: ${order.project}`,
    `Nama: ${order.customer}`,
    `Skema: ${paymentMode}`,
    `Nominal dibayar: ${rupiah.format(dueNow)}`,
    `Sisa tagihan: ${rupiah.format(remaining)}`,
    `Catatan bukti: ${order.receipt || "-"}`,
  ].join("\n");

  const updateQuote = (event) => {
    const { name, value } = event.target;
    setQuote((current) => ({ ...current, [name]: Number(value) }));
  };

  const updateOrder = (event) => {
    const { name, value } = event.target;
    setOrder((current) => ({ ...current, [name]: value }));
  };

  const waPaymentUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    paymentMessage
  )}`;

  return (
    <div className="system-app">
      <aside className="system-sidebar">
        <a className="brand" href="/">
          <span>3D</span>
          <strong>3Dridens</strong>
        </a>
        <nav className="system-nav" aria-label="Navigasi sistem order">
          <a href="#konsultasi">Konsultasi</a>
          <a href="#estimasi">Estimasi</a>
          <a href="#pembayaran">Pembayaran</a>
          <a href="#progress">Progress</a>
          <a href="/sistem/pembayaran">Detail Pembayaran</a>
        </nav>
        <div className="system-status">
          <span>Order aktif</span>
          <strong>3DR-2607-014</strong>
          <p>{progress}% selesai</p>
          <div className="progress-track">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
      </aside>

      <main className="system-main">
        <section className="system-hero slide-group">
          <p className="eyebrow">Order workflow</p>
          <h1>Satu sistem dari konsultasi, pembayaran, produksi, sampai barang jadi.</h1>
          <p>
            Tampilan ini mensimulasikan ruang kerja customer dan admin. Admin
            mengisi biaya, customer memilih DP atau full payment, lalu progress
            pengerjaan bisa dipantau dari satu halaman.
          </p>
        </section>

        <section className="system-grid" id="konsultasi">
          <article className="system-panel system-panel-wide">
            <div className="panel-heading">
              <span>01</span>
              <div>
                <h2>Konsultasi project</h2>
                <p>Brief awal sebelum admin menentukan biaya.</p>
              </div>
            </div>
            <div className="brief-grid">
              <label className="system-field">
                <span>Nama customer</span>
                <input name="customer" onChange={updateOrder} value={order.customer} />
              </label>
              <label className="system-field">
                <span>Project</span>
                <input name="project" onChange={updateOrder} value={order.project} />
              </label>
              <label className="system-field">
                <span>Material</span>
                <input name="material" onChange={updateOrder} value={order.material} />
              </label>
              <label className="system-field">
                <span>Jumlah</span>
                <input name="quantity" onChange={updateOrder} value={order.quantity} />
              </label>
              <label className="system-field">
                <span>Deadline</span>
                <input name="deadline" onChange={updateOrder} value={order.deadline} />
              </label>
            </div>
            <label className="system-field">
              <span>Catatan admin</span>
              <textarea
                name="adminNote"
                onChange={updateOrder}
                rows="4"
                value={order.adminNote}
              />
            </label>
          </article>

          <article className="system-panel" id="estimasi">
            <div className="panel-heading">
              <span>02</span>
              <div>
                <h2>Admin set biaya</h2>
                <p>Nilai ini langsung mengubah invoice customer.</p>
              </div>
            </div>
            <div className="price-fields">
              <Field
                label="Desain"
                name="designFee"
                onChange={updateQuote}
                prefix="Rp"
                value={quote.designFee}
              />
              <Field
                label="Cetak"
                name="printingFee"
                onChange={updateQuote}
                prefix="Rp"
                value={quote.printingFee}
              />
              <Field
                label="Finishing"
                name="finishingFee"
                onChange={updateQuote}
                prefix="Rp"
                value={quote.finishingFee}
              />
              <Field
                label="Pengiriman"
                name="shippingFee"
                onChange={updateQuote}
                prefix="Rp"
                value={quote.shippingFee}
              />
              <Field
                label="DP"
                name="dpPercent"
                onChange={updateQuote}
                suffix="%"
                value={quote.dpPercent}
              />
            </div>
          </article>

          <article className="system-panel invoice-panel" id="pembayaran">
            <div className="panel-heading">
              <span>03</span>
              <div>
                <h2>Pembayaran</h2>
                <p>Customer bisa pilih DP atau bayar penuh.</p>
              </div>
            </div>
            <div className="payment-toggle" role="group" aria-label="Pilihan pembayaran">
              {["DP", "Full"].map((mode) => (
                <button
                  className={paymentMode === mode ? "active" : ""}
                  key={mode}
                  onClick={() => setPaymentMode(mode)}
                  type="button"
                >
                  {mode === "DP" ? `DP ${quote.dpPercent}%` : "Bayar Full"}
                </button>
              ))}
            </div>
            <div className="invoice-list">
              <div>
                <span>Desain</span>
                <strong>{rupiah.format(quote.designFee)}</strong>
              </div>
              <div>
                <span>Cetak</span>
                <strong>{rupiah.format(quote.printingFee)}</strong>
              </div>
              <div>
                <span>Finishing</span>
                <strong>{rupiah.format(quote.finishingFee)}</strong>
              </div>
              <div>
                <span>Pengiriman</span>
                <strong>{rupiah.format(quote.shippingFee)}</strong>
              </div>
            </div>
            <div className="invoice-total">
              <span>Total order</span>
              <strong>{rupiah.format(total)}</strong>
            </div>
            <div className="payment-summary">
              <div>
                <span>Dibayar sekarang</span>
                <strong>{rupiah.format(dueNow)}</strong>
              </div>
              <div>
                <span>Sisa tagihan</span>
                <strong>{rupiah.format(remaining)}</strong>
              </div>
            </div>
            <div className="bank-box">
              <span>Transfer ke</span>
              <strong>BCA 1234567890 a.n. 3Dridens Studio</strong>
            </div>
            <label className="system-field">
              <span>Catatan bukti pembayaran</span>
              <textarea
                name="receipt"
                onChange={updateOrder}
                placeholder="Contoh: sudah transfer BCA, an Raka, 2 Juli 2026 jam 14.20"
                rows="3"
                value={order.receipt}
              />
            </label>
            <a className="primary-button" href={waPaymentUrl} target="_blank">
              Konfirmasi via WhatsApp
            </a>
          </article>
        </section>

        <section className="system-panel timeline-panel" id="progress">
          <div className="panel-heading">
            <span>04</span>
            <div>
              <h2>Progress pengerjaan</h2>
              <p>Admin klik status terbaru, customer langsung tahu posisi order.</p>
            </div>
          </div>
          <div className="timeline">
            {stages.map((stage, index) => (
              <button
                className={index <= currentStage ? "done" : ""}
                key={stage.label}
                onClick={() => setCurrentStage(index)}
                type="button"
              >
                <i>{index + 1}</i>
                <span>{stage.label}</span>
                <small>{stage.detail}</small>
              </button>
            ))}
          </div>
          <div className="shipping-row">
            <label className="system-field">
              <span>Resi / update pengiriman</span>
              <input name="tracking" onChange={updateOrder} value={order.tracking} />
            </label>
            <div className="status-card">
              <span>Status customer</span>
              <strong>{stages[currentStage].label}</strong>
              <p>{stages[currentStage].detail}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

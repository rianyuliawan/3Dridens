import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/profile";
import { determinePaymentIntent } from "@/lib/midtrans";
import { getSignedPhotoUrls } from "@/lib/storage";
import OrderPricingForm from "./OrderPricingForm";
import ShippingForm from "./ShippingForm";
import PaymentButton from "./PaymentButton";
import ProgressForm from "./ProgressForm";

const PAYMENT_STATUS_LABEL = {
  pending: "Menunggu",
  settlement: "Berhasil",
  capture: "Berhasil",
  deny: "Ditolak",
  cancel: "Dibatalkan",
  expire: "Kedaluwarsa",
  failure: "Gagal",
};

const PAYMENT_PURPOSE_LABEL = { dp: "DP", full: "Bayar Penuh", pelunasan: "Pelunasan" };

const STATUS_LABEL = {
  awaiting_payment: "Menunggu pembayaran",
  processing: "Diproses",
  ready_to_ship: "Siap dikirim",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const STAGE_LABEL = {
  konsultasi: "Konsultasi",
  estimasi: "Estimasi",
  pembayaran: "Pembayaran",
  desain: "Desain",
  produksi: "Produksi",
  finishing: "Finishing",
  qc_kirim: "QC & Kirim",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

export const metadata = {
  title: "Detail Order | 3Dridens",
};

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user) notFound();

  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();

  if (!order) notFound();

  const { data: payments } = await supabase
    .from("payments")
    .select("id, purpose, amount, status, payment_type, created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const { data: progressUpdates } = await supabase
    .from("progress_updates")
    .select("id, stage, note, photo_paths, created_at")
    .eq("order_id", id)
    .order("created_at", { ascending: false });

  const progressWithPhotos = await Promise.all(
    (progressUpdates || []).map(async (entry) => ({
      ...entry,
      photoUrls: await getSignedPhotoUrls(entry.photo_paths),
    }))
  );

  const isAdmin = profile?.role === "admin";
  const remaining = Number(order.total_amount) - Number(order.amount_paid);
  const paymentIntent = determinePaymentIntent(order);
  const canPay =
    !isAdmin && paymentIntent && !["completed", "cancelled"].includes(order.status);

  return (
    <main className="site-shell">
      <nav className="topbar">
        <Link className="brand" href={isAdmin ? "/admin" : "/dashboard"} aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <div className="nav-links">
          <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
          {order.consultation_id ? (
            <Link href={`/consultation/${order.consultation_id}`}>Konsultasi</Link>
          ) : null}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Order {order.order_number}</p>
          <h1>{STATUS_LABEL[order.status]}</h1>
          <p className="lead">
            Tahap saat ini: <span className="status-pill">{STAGE_LABEL[order.current_stage]}</span>
          </p>
          <div className="stats">
            <div>
              <strong>{rupiah.format(order.total_amount)}</strong>
              <span>Total order</span>
            </div>
            <div>
              <strong>{rupiah.format(order.amount_paid)}</strong>
              <span>Sudah dibayar</span>
            </div>
            <div>
              <strong>{rupiah.format(remaining)}</strong>
              <span>Sisa tagihan</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section services">
        <div className="system-grid">
          <article className="system-panel system-panel-wide invoice-panel">
            <div className="panel-heading">
              <span>01</span>
              <div>
                <h2>Rincian biaya</h2>
                <p>Skema pembayaran: {order.payment_scheme === "dp" ? `DP ${order.dp_percent}%` : "Bayar penuh"}</p>
              </div>
            </div>
            <div className="invoice-list">
              <div>
                <span>Desain</span>
                <strong>{rupiah.format(order.design_fee)}</strong>
              </div>
              <div>
                <span>Cetak</span>
                <strong>{rupiah.format(order.printing_fee)}</strong>
              </div>
              <div>
                <span>Finishing</span>
                <strong>{rupiah.format(order.finishing_fee)}</strong>
              </div>
              <div>
                <span>Pengiriman</span>
                <strong>{rupiah.format(order.shipping_fee)}</strong>
              </div>
            </div>
            <div className="invoice-total">
              <span>Total order</span>
              <strong>{rupiah.format(order.total_amount)}</strong>
            </div>
            {canPay ? (
              <PaymentButton
                amount={paymentIntent.amount}
                orderId={order.id}
                purpose={paymentIntent.purpose}
              />
            ) : null}
            {!isAdmin && !paymentIntent && order.status !== "cancelled" ? (
              <p className="auth-success">Order ini sudah lunas.</p>
            ) : null}
            {order.admin_note ? (
              <div className="system-field">
                <span>Catatan admin</span>
                <p>{order.admin_note}</p>
              </div>
            ) : null}
            {order.tracking_number ? (
              <div className="system-field">
                <span>Nomor resi</span>
                <p>{order.tracking_number}</p>
              </div>
            ) : null}
          </article>

          {isAdmin ? <OrderPricingForm order={order} /> : null}
        </div>

        {(payments || []).length > 0 ? (
          <article className="system-panel">
            <div className="panel-heading">
              <span>+</span>
              <div>
                <h2>Riwayat pembayaran</h2>
                <p>Status transaksi dari Midtrans.</p>
              </div>
            </div>
            <div className="admin-list">
              {payments.map((payment) => (
                <div className="admin-list-row" key={payment.id}>
                  <div>
                    <strong>{PAYMENT_PURPOSE_LABEL[payment.purpose]}</strong>
                    <span>{new Date(payment.created_at).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="admin-list-meta">
                    <span>{rupiah.format(payment.amount)}</span>
                    <span
                      className={`status-pill ${
                        payment.status === "settlement" || payment.status === "capture"
                          ? "is-success"
                          : payment.status === "pending"
                            ? "is-pending"
                            : "is-danger"
                      }`}
                    >
                      {PAYMENT_STATUS_LABEL[payment.status]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ) : null}

        <article className="system-panel">
          <div className="panel-heading">
            <span>+</span>
            <div>
              <h2>Progress produksi</h2>
              <p>Update terbaru muncul paling atas.</p>
            </div>
          </div>
          {progressWithPhotos.length === 0 ? (
            <p>Belum ada update progress.</p>
          ) : (
            <div className="progress-feed">
              {progressWithPhotos.map((entry) => (
                <div className="progress-entry" key={entry.id}>
                  <div className="progress-entry-heading">
                    <span className="status-pill">{STAGE_LABEL[entry.stage]}</span>
                    <time>{new Date(entry.created_at).toLocaleString("id-ID")}</time>
                  </div>
                  {entry.note ? <p>{entry.note}</p> : null}
                  {entry.photoUrls.length > 0 ? (
                    <div className="progress-photos">
                      {entry.photoUrls.map((url) => (
                        <div className="image-frame" key={url}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- short-lived signed URLs, not worth Next/Image optimization caching */}
                          <img alt={`Progress ${STAGE_LABEL[entry.stage]}`} className="media-image" src={url} />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </article>

        {isAdmin ? <ProgressForm currentStage={order.current_stage} orderId={order.id} /> : null}

        {isAdmin ? <ShippingForm order={order} /> : null}

        {order.status === "completed" || Number(order.amount_paid) > 0 ? (
          <Link className="ghost-button" href={`/order/${order.id}/invoice`}>
            Lihat Nota / Invoice
          </Link>
        ) : null}
      </section>
    </main>
  );
}

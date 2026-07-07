import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/profile";

const CONSULTATION_STATUS_LABEL = {
  new: "Baru",
  discussing: "Sedang dibahas",
  quoted: "Sudah ditawar harga",
  converted: "Sudah jadi order",
  declined: "Ditolak",
};

const ORDER_STATUS_LABEL = {
  awaiting_payment: "Menunggu pembayaran",
  processing: "Diproses",
  ready_to_ship: "Siap dikirim",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

export default async function DashboardPage() {
  const { user, profile } = await getSessionProfile();
  const supabase = await createClient();

  const [{ data: consultations }, { data: orders }] = await Promise.all([
    supabase
      .from("consultations")
      .select("id, title, status, created_at")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("id, order_number, status, total_amount, created_at")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Dashboard Customer</p>
        <h1>
          Halo, {profile?.full_name || "Customer"}. Ini ruang kerja order kamu.
        </h1>
        <p>Pantau konsultasi dan order kamu di sini.</p>
      </section>

      <section className="system-panel">
        <div className="panel-heading">
          <span>01</span>
          <div>
            <h2>Konsultasi kamu</h2>
            <p>Riwayat konsultasi yang sudah diajukan.</p>
          </div>
        </div>
        <div className="admin-list">
          {(consultations || []).length === 0 ? (
            <p>Belum ada konsultasi. Mulai dengan mengajukan yang baru.</p>
          ) : null}
          {(consultations || []).map((item) => (
            <Link className="admin-list-row" href={`/consultation/${item.id}`} key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
              </div>
              <span className="status-pill">{CONSULTATION_STATUS_LABEL[item.status]}</span>
            </Link>
          ))}
        </div>
        <Link className="primary-button" href="/consultation/new">
          Ajukan Konsultasi Baru
        </Link>
      </section>

      {(orders || []).length > 0 ? (
        <section className="system-panel">
          <div className="panel-heading">
            <span>02</span>
            <div>
              <h2>Order kamu</h2>
              <p>Status pembayaran dan produksi.</p>
            </div>
          </div>
          <div className="admin-list">
            {orders.map((item) => (
              <Link className="admin-list-row" href={`/order/${item.id}`} key={item.id}>
                <div>
                  <strong>{item.order_number}</strong>
                  <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                </div>
                <span className="status-pill">{ORDER_STATUS_LABEL[item.status]}</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

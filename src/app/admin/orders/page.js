import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL = {
  awaiting_payment: "Menunggu pembayaran",
  processing: "Diproses",
  ready_to_ship: "Siap dikirim",
  shipped: "Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

export const metadata = {
  title: "Order | Admin 3Dridens",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, created_at, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Order</p>
        <h1>Semua order customer.</h1>
        <p>Kelola harga, progress, dan pengiriman dari setiap order.</p>
      </section>

      <section className="system-panel">
        <div className="admin-list">
          {(orders || []).length === 0 ? <p>Belum ada order.</p> : null}
          {(orders || []).map((item) => (
            <Link className="admin-list-row" href={`/order/${item.id}`} key={item.id}>
              <div>
                <strong>{item.order_number}</strong>
                <span>{item.profiles?.full_name || "Customer"}</span>
              </div>
              <div className="admin-list-meta">
                <span>{rupiah.format(item.total_amount)}</span>
                <span className="status-pill">{STATUS_LABEL[item.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

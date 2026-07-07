import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/profile";
import PrintButton from "./PrintButton";

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

const tanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const metadata = {
  title: "Nota | 3Dridens",
};

export default async function InvoicePage({ params }) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user) notFound();

  const supabase = await createClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", id).single();
  if (!order) notFound();

  const isAdmin = profile?.role === "admin";
  const { data: customerProfile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", order.customer_id)
    .single();

  const remaining = Number(order.total_amount) - Number(order.amount_paid);
  const isLunas = remaining <= 0;

  const items = [
    { label: "Desain", amount: order.design_fee },
    { label: "Cetak", amount: order.printing_fee },
    { label: "Finishing", amount: order.finishing_fee },
    { label: "Pengiriman", amount: order.shipping_fee },
  ];

  return (
    <main className="invoice-shell">
      <div className="hero-actions no-print invoice-actions">
        <Link className="ghost-button" href={`/order/${order.id}`}>
          Kembali ke Order
        </Link>
        <PrintButton />
      </div>

      <article className="invoice-print">
        <div className="invoice-print-head">
          <div>
            <div className="brand">
              <span>3D</span>
              <strong>3Dridens</strong>
            </div>
            <address>
              Jasa 3D Printing Custom
              <br />
              WhatsApp: 0856-9155-5890
            </address>
          </div>
          <div className="invoice-meta">
            <h1>NOTA</h1>
            <p>{order.order_number}</p>
            <p>{tanggal.format(new Date(order.created_at))}</p>
            <p>{isLunas ? "LUNAS" : "BELUM LUNAS"}</p>
          </div>
        </div>

        <div className="invoice-parties">
          <div>
            <h3>Ditagihkan kepada</h3>
            <p>{customerProfile?.full_name || "Customer"}</p>
            {customerProfile?.phone ? <p>{customerProfile.phone}</p> : null}
          </div>
          <div>
            <h3>Detail order</h3>
            <p>Material: {order.material || "-"}</p>
            <p>Jumlah: {order.quantity || "-"}</p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Biaya</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>{rupiah.format(item.amount)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{rupiah.format(order.total_amount)}</strong>
              </td>
            </tr>
            <tr>
              <td>Sudah dibayar</td>
              <td>{rupiah.format(order.amount_paid)}</td>
            </tr>
            <tr>
              <td>
                <strong>Sisa tagihan</strong>
              </td>
              <td>
                <strong>{rupiah.format(Math.max(remaining, 0))}</strong>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="invoice-print-footer">
          <span>Transfer: BCA 1234567890 a.n. 3Dridens Studio</span>
          <span>Terima kasih sudah mempercayakan project ke 3Dridens.</span>
        </div>
      </article>
    </main>
  );
}

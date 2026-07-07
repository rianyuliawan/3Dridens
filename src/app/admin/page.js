import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: newConsultations }, { count: awaitingPayment }, { count: processingOrders }] =
    await Promise.all([
      supabase
        .from("consultations")
        .select("id", { count: "exact", head: true })
        .eq("status", "new"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "awaiting_payment"),
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "processing"),
    ]);

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Ringkasan Admin</p>
        <h1>Pusat kendali order, pembayaran, dan konten 3Dridens.</h1>
        <p>Konsultasi baru dan status order terkini ada di bawah.</p>
      </section>

      <section className="service-grid reveal-grid">
        <Link href="/admin/consultations">
          <article>
            <span>01</span>
            <h3>{newConsultations ?? 0}</h3>
            <p>Konsultasi baru menunggu respon</p>
          </article>
        </Link>
        <Link href="/admin/orders">
          <article>
            <span>02</span>
            <h3>{awaitingPayment ?? 0}</h3>
            <p>Order menunggu pembayaran</p>
          </article>
        </Link>
        <Link href="/admin/orders">
          <article>
            <span>03</span>
            <h3>{processingOrders ?? 0}</h3>
            <p>Order sedang diproses</p>
          </article>
        </Link>
      </section>

      <section className="system-panel">
        <div className="panel-heading">
          <span>+</span>
          <div>
            <h2>Kelola konten publik</h2>
            <p>Portfolio dan testimoni yang tayang di halaman publik.</p>
          </div>
        </div>
        <div className="form-actions">
          <Link className="primary-button" href="/admin/portfolio">
            Kelola Portfolio
          </Link>
          <Link className="secondary-button" href="/admin/testimonials">
            Kelola Testimoni
          </Link>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const STATUS_LABEL = {
  new: "Baru",
  discussing: "Sedang dibahas",
  quoted: "Sudah ditawar harga",
  converted: "Sudah jadi order",
  declined: "Ditolak",
};

export const metadata = {
  title: "Konsultasi | Admin 3Dridens",
};

export default async function AdminConsultationsPage() {
  const supabase = await createClient();
  const { data: consultations } = await supabase
    .from("consultations")
    .select("id, title, type, status, created_at, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Konsultasi</p>
        <h1>Semua konsultasi yang masuk.</h1>
        <p>Klik salah satu untuk membalas atau membuat penawaran harga.</p>
      </section>

      <section className="system-panel">
        <div className="admin-list">
          {(consultations || []).length === 0 ? (
            <p>Belum ada konsultasi yang masuk.</p>
          ) : null}
          {(consultations || []).map((item) => (
            <Link className="admin-list-row" href={`/consultation/${item.id}`} key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.profiles?.full_name || "Customer"}</span>
              </div>
              <div className="admin-list-meta">
                <span>{new Date(item.created_at).toLocaleDateString("id-ID")}</span>
                <span className="status-pill">{STATUS_LABEL[item.status]}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

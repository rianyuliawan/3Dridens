import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionProfile } from "@/lib/supabase/profile";
import MessageForm from "./MessageForm";
import StatusForm from "./StatusForm";
import ConvertToOrderForm from "./ConvertToOrderForm";

const TYPE_LABEL = { design: "Bantuan desain", printing: "Cetak 3D", both: "Desain + cetak" };
const STATUS_LABEL = {
  new: "Baru",
  discussing: "Sedang dibahas",
  quoted: "Sudah ditawar harga",
  converted: "Sudah jadi order",
  declined: "Ditolak",
};

export const metadata = {
  title: "Detail Konsultasi | 3Dridens",
};

export default async function ConsultationDetailPage({ params }) {
  const { id } = await params;
  const { user, profile } = await getSessionProfile();
  if (!user) notFound();

  const supabase = await createClient();

  const { data: consultation } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", id)
    .single();

  if (!consultation) notFound();

  const { data: messages } = await supabase
    .from("consultation_messages")
    .select("id, body, created_at, sender_id, profiles(full_name)")
    .eq("consultation_id", id)
    .order("created_at", { ascending: true });

  const { data: existingOrder } = await supabase
    .from("orders")
    .select("id")
    .eq("consultation_id", id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  return (
    <main className="site-shell">
      <nav className="topbar">
        <Link className="brand" href={isAdmin ? "/admin" : "/dashboard"} aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <div className="nav-links">
          <Link href={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Konsultasi</p>
          <h1>{consultation.title}</h1>
          <p className="lead">
            {TYPE_LABEL[consultation.type]} ·{" "}
            <span className="status-pill">{STATUS_LABEL[consultation.status]}</span>
          </p>
        </div>
      </section>

      <section className="section services">
        <div className="system-grid">
          <article className="system-panel system-panel-wide">
            <div className="panel-heading">
              <span>01</span>
              <div>
                <h2>Detail project</h2>
                <p>Brief yang dikirim customer.</p>
              </div>
            </div>
            <div className="brief-grid">
              <div className="system-field">
                <span>Material</span>
                <p>{consultation.material_pref || "Belum ditentukan"}</p>
              </div>
              <div className="system-field">
                <span>Jumlah</span>
                <p>{consultation.quantity || "-"}</p>
              </div>
              <div className="system-field">
                <span>Target selesai</span>
                <p>{consultation.deadline || "Belum ditentukan"}</p>
              </div>
            </div>
            {consultation.description ? (
              <div className="system-field">
                <span>Deskripsi</span>
                <p>{consultation.description}</p>
              </div>
            ) : null}

            <div className="chat-thread">
              {(messages || []).length === 0 ? (
                <p>Belum ada pesan. Mulai percakapan di bawah.</p>
              ) : null}
              {(messages || []).map((message) => (
                <div
                  className={`chat-bubble ${message.sender_id === user.id ? "is-mine" : ""}`}
                  key={message.id}
                >
                  <strong>{message.profiles?.full_name || "User"}</strong>
                  <p>{message.body}</p>
                  <time>{new Date(message.created_at).toLocaleString("id-ID")}</time>
                </div>
              ))}
            </div>
            <MessageForm consultationId={id} />
          </article>

          <article className="system-panel">
            <div className="panel-heading">
              <span>02</span>
              <div>
                <h2>Status</h2>
                <p>Perkembangan konsultasi ini.</p>
              </div>
            </div>
            <p>
              Status saat ini: <span className="status-pill">{STATUS_LABEL[consultation.status]}</span>
            </p>
            {existingOrder ? (
              <Link className="primary-button" href={`/order/${existingOrder.id}`}>
                Lihat Order
              </Link>
            ) : null}
            {isAdmin ? (
              <StatusForm consultationId={id} currentStatus={consultation.status} />
            ) : null}
          </article>
        </div>

        {isAdmin && !existingOrder ? (
          <ConvertToOrderForm
            consultationId={id}
            defaultMaterial={consultation.material_pref}
            defaultQuantity={consultation.quantity}
          />
        ) : null}
      </section>
    </main>
  );
}

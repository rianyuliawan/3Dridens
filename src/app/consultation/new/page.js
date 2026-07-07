import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/supabase/profile";
import ConsultationForm from "./ConsultationForm";

export const metadata = {
  title: "Konsultasi Baru | 3Dridens",
  description: "Ajukan konsultasi design dan cetak 3D ke tim 3Dridens.",
};

export default async function ConsultationNewPage() {
  const { user } = await getSessionProfile();
  if (!user) {
    redirect("/login?next=/consultation/new");
  }

  return (
    <main className="site-shell">
      <nav className="topbar">
        <Link className="brand" href="/dashboard" aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <div className="nav-links">
          <Link href="/dashboard">Dashboard</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Konsultasi Baru</p>
          <h1>Mulai project design atau cetak 3D kamu.</h1>
          <p className="lead">
            Isi detail di bawah, admin akan meninjau dan membalas lewat
            halaman konsultasi kamu. Setelah harga disepakati, admin akan
            membuatkan order untuk pembayaran.
          </p>
        </div>
      </section>

      <section className="section services">
        <ConsultationForm />
      </section>
    </main>
  );
}

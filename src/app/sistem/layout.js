import Link from "next/link";

export const metadata = {
  title: "Sistem Order 3Dridens",
  description: "Rangkaian halaman sistem order untuk konsultasi, estimasi, pembayaran, tracking, dan ringkasan.",
};

export default function SistemLayout({ children }) {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </a>
        <div className="nav-links">
          <Link href="/sistem">Dashboard</Link>
          <Link href="/sistem/estimasi">Estimasi</Link>
          <Link href="/sistem/pembayaran">Pembayaran</Link>
          <Link href="/sistem/progress">Progress</Link>
          <Link href="/sistem/ringkasan">Ringkasan</Link>
        </div>
        <a className="nav-cta" href="/">Beranda</a>
      </header>
      <div className="page-shell">{children}</div>
    </div>
  );
}

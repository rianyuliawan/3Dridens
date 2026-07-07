import Image from "next/image";
import Link from "next/link";
import { getPortfolioItems } from "@/lib/data/portfolio";

export const metadata = {
  title: "Portfolio | 3Dridens",
  description: "Kumpulan hasil desain dan cetak 3D dari 3Dridens.",
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  return (
    <main className="site-shell">
      <nav className="topbar">
        <Link className="brand" href="/" aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <div className="nav-links">
          <Link href="/">Beranda</Link>
          <Link href="/testimoni">Testimoni</Link>
        </div>
        <a className="nav-cta" href="/login">
          Masuk
        </a>
      </nav>

      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Portfolio</p>
          <h1>Hasil desain dan cetak 3D dari berbagai project.</h1>
          <p className="lead">
            Sebagian contoh berikut memakai foto referensi sementara. Foto
            hasil kerja asli akan menggantikan galeri ini seiring project baru
            selesai dikerjakan.
          </p>
        </div>
      </section>

      <section className="section results" id="portfolio">
        <div className="section-heading">
          <p className="eyebrow">Galeri</p>
          <h2>Contoh output prototype, fungsional, miniatur, dan desain custom.</h2>
        </div>
        <div className="gallery-grid reveal-grid">
          {items.map((item, index) => (
            <article className="gallery-card" key={item.id}>
              <Image
                alt={item.title}
                className="media-image"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src={item.image_url}
              />
              <div>
                <span>{item.category || `0${index + 1}`}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

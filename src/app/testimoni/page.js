import Link from "next/link";
import { getTestimonials } from "@/lib/data/testimonials";

export const metadata = {
  title: "Testimoni | 3Dridens",
  description: "Testimoni customer yang sudah menggunakan jasa 3Dridens.",
};

export default async function TestimoniPage() {
  const testimonials = await getTestimonials();

  return (
    <main className="site-shell">
      <nav className="topbar">
        <Link className="brand" href="/" aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <div className="nav-links">
          <Link href="/">Beranda</Link>
          <Link href="/portfolio">Portfolio</Link>
        </div>
        <a className="nav-cta" href="/login">
          Masuk
        </a>
      </nav>

      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Testimoni</p>
          <h1>Apa kata customer setelah project selesai.</h1>
          <p className="lead">
            Sebagian testimoni berikut adalah contoh sementara untuk
            menggambarkan pengalaman customer. Testimoni asli akan
            menggantikan seiring project baru selesai.
          </p>
        </div>
      </section>

      <section className="section results" id="testimoni">
        <div className="section-heading">
          <p className="eyebrow">Cerita customer</p>
          <h2>Pengalaman konsultasi sampai barang jadi.</h2>
        </div>
        <div className="testimonial-grid reveal-grid">
          {testimonials.map((item) => (
            <article className="testimonial-card" key={item.id}>
              <span className="testimonial-rating" aria-label={`Rating ${item.rating} dari 5`}>
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </span>
              <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
              <div className="testimonial-author">
                <strong>{item.customer_name}</strong>
                {item.role_or_context ? <span>{item.role_or_context}</span> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: "Ringkasan Order | 3Dridens",
  description: "Halaman ringkasan order yang menunjukkan konfigurasi proyek, biaya, dan status akhir.",
};

export default function RingkasanPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Ringkasan Order</p>
          <h1>Detail lengkap order dan keputusan terakhir.</h1>
          <p className="lead">
            Halaman ringkasan membantu admin menyatukan informasi konsultasi, estimasi, pembayaran,
            dan status produksi dalam satu tampilan.
          </p>
        </div>
      </section>

      <section className="section services">
        <div className="section-heading">
          <p className="eyebrow">Order Details</p>
          <h2>Data project dan keputusan customer.</h2>
        </div>
        <div className="service-grid reveal-grid">
          <article>
            <h3>Project</h3>
            <p>Prototype casing sensor IoT</p>
            <p>Material: PETG</p>
            <p>Jumlah: 2 pcs</p>
          </article>
          <article>
            <h3>Biaya</h3>
            <p>Total: Rp 520.000</p>
            <p>DP: Rp 260.000</p>
            <p>Metode: Transfer bank</p>
          </article>
          <article>
            <h3>Status akhir</h3>
            <p>Payment: menunggu konfirmasi</p>
            <p>Produksi: siap diteruskan setelah pembayaran.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

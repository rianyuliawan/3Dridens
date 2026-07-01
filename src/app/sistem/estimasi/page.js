export const metadata = {
  title: "Estimasi Biaya | 3Dridens",
  description: "Halaman estimasi biaya order untuk admin dan customer melihat breakdown harga.",
};

const estimateItems = [
  { label: "Desain", value: 85000 },
  { label: "Cetak", value: 320000 },
  { label: "Finishing", value: 125000 },
  { label: "Pengiriman", value: 25000 },
];

const rupiah = new Intl.NumberFormat("id-ID", {
  currency: "IDR",
  maximumFractionDigits: 0,
  style: "currency",
});

export default function EstimasiPage() {
  const total = estimateItems.reduce((sum, item) => sum + item.value, 0);
  const dp = Math.round(total * 0.5);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Estimasi Order</p>
          <h1>Detail biaya estimasi untuk order 3D printing.</h1>
          <p className="lead">
            Halaman ini menampilkan breakdown biaya desain, cetak, finishing, dan pengiriman untuk
            membantu admin memberi penawaran yang jelas kepada customer.
          </p>
        </div>
      </section>

      <section className="section services">
        <div className="section-heading">
          <p className="eyebrow">Rincian biaya</p>
          <h2>Angka yang digunakan untuk penawaran dan invoice.</h2>
        </div>
        <div className="service-grid reveal-grid">
          {estimateItems.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{rupiah.format(item.value)}</p>
            </article>
          ))}
          <article>
            <h3>Total estimasi</h3>
            <strong>{rupiah.format(total)}</strong>
          </article>
          <article>
            <h3>Pilihan DP</h3>
            <p>{rupiah.format(dp)} (50% dari total)</p>
          </article>
        </div>
      </section>

      <section className="section results">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Langkah berikutnya</p>
            <h2>Setelah estimasi selesai.</h2>
          </div>
          <p>
            Bila customer setuju, admin dapat mengarahkan ke halaman pembayaran untuk
            konfirmasi DP atau full payment dan lanjutkan proses produksi.
          </p>
        </div>
      </section>
    </main>
  );
}

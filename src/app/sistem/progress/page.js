export const metadata = {
  title: "Tracking Progress | 3Dridens",
  description: "Halaman tracking progress order 3D printing dari desain sampai pengiriman.",
};

const stages = [
  {
    title: "Konsultasi dan brief",
    description: "Customer mengirim brief, referensi, dan request desain.",
    status: "Selesai",
  },
  {
    title: "Estimasi biaya",
    description: "Admin membuat breakdown biaya dan opsi pembayaran.",
    status: "Selesai",
  },
  {
    title: "Pembayaran DP",
    description: "Customer transfer DP dan admin melakukan verifikasi.",
    status: "Sedang berlangsung",
  },
  {
    title: "Produksi dan finishing",
    description: "Cetak 3D, sanding, dan perapihan kualitas.",
    status: "Menunggu",
  },
  {
    title: "QC dan pengiriman",
    description: "Quality check, pelunasan, packing, dan kirim.",
    status: "Menunggu",
  },
];

export default function ProgressPage() {
  return (
    <main>
      <section className="hero">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Tracking Progress</p>
          <h1>Monitoring status pengerjaan order secara real-time.</h1>
          <p className="lead">
            Halaman ini membantu admin dan customer melihat setiap tahapan produksi dan status terkini.
          </p>
        </div>
      </section>

      <section className="section services">
        <div className="section-heading">
          <p className="eyebrow">Timeline order</p>
          <h2>Status setiap fase project.</h2>
        </div>
        <div className="service-grid reveal-grid">
          {stages.map((stage) => (
            <article key={stage.title}>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <strong>{stage.status}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

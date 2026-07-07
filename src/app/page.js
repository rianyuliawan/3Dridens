import Image from "next/image";
import Link from "next/link";
import OrderForm from "./OrderForm";

const waLink =
  "https://wa.me/6285691555890?text=Halo%203Dridens%2C%20saya%20mau%20konsultasi%20project%203D%20printing.";

const gallery = [
  {
    title: "Prototype siap pakai",
    src: "/assets/hasil.jpeg",
  },
  {
    title: "Part presisi untuk casing dan bracket",
    src: "/assets/hasil 1.jpeg",
  },
  {
    title: "Display object dan mockup produk",
    src: "/assets/hasil 2.webp",
  },
  {
    title: "Miniatur dan part custom",
    src: "/assets/hasil 3.jpg",
  },
  {
    title: "Batch produksi kecil",
    src: "/assets/hasil 4.jpeg",
  },
];

const services = [
  {
    title: "Cetak 3D Custom",
    detail:
      "Cetak file STL, OBJ, atau STEP untuk prototype, spare part, enclosure, holder, jig, dan kebutuhan personal.",
  },
  {
    title: "Bantuan Desain",
    detail:
      "Belum punya file siap cetak? Kami bantu rapikan ukuran, bentuk, toleransi, dan orientasi cetak agar hasilnya masuk akal.",
  },
  {
    title: "Finishing",
    detail:
      "Sanding, primer, painting, dan perapihan permukaan untuk display, hadiah, properti konten, atau produk presentasi.",
  },
];

const steps = [
  "Kirim brief, ukuran, referensi, atau file 3D.",
  "Kami cek material, estimasi waktu, dan biaya.",
  "Proses slicing, printing, dan quality check.",
  "Finishing sesuai kebutuhan lalu siap dikirim atau diambil.",
];

const guides = [
  "PLA cocok untuk display, prototype cepat, dan warna yang rapi.",
  "PETG lebih kuat untuk part fungsional yang butuh daya tahan.",
  "TPU lentur untuk bumper, grip, seal ringan, dan part fleksibel.",
  "Finishing membuat layer line lebih halus untuk hasil premium.",
];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MediaImage({ alt, className = "", fill = false, height, src, width }) {
  return (
    <Image
      alt={alt}
      className={`media-image ${className}`}
      fill={fill}
      height={height}
      priority={src === "/assets/hasil.jpeg"}
      sizes="(max-width: 768px) 100vw, 50vw"
      src={src}
      width={width}
    />
  );
}

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="topbar">
        <a className="brand" href="#top" aria-label="3Dridens home">
          <span>3D</span>
          <strong>3Dridens</strong>
        </a>
        <div className="nav-links">
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/testimoni">Testimoni</Link>
          <a href="#panduan">Panduan</a>
          <a href="#proses">Proses</a>
          <a href="#order">Order</a>
        </div>
        <div className="nav-actions">
          <Link className="ghost-button" href="/login">
            Masuk
          </Link>
          <a className="nav-cta" href={waLink} target="_blank">
            WhatsApp
          </a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy slide-group">
          <p className="eyebrow">Konsultasi, pembayaran, produksi, dan tracking</p>
          <h1>Sistem order 3D printing dari brief sampai barang jadi.</h1>
          <p className="lead">
            3Dridens membantu customer mulai dari konsultasi desain, estimasi
            biaya dari admin, pilihan DP atau full payment, update proses
            produksi, finishing, quality check, sampai pengiriman.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/consultation/new">
              Ajukan Konsultasi <ArrowIcon />
            </Link>
            <a className="secondary-button" href="#order">
              Konsultasi via WhatsApp
            </a>
          </div>
          <div className="stats">
            <div>
              <strong>Konsultasi</strong>
              <span>brief dan desain</span>
            </div>
            <div>
              <strong>DP / Full</strong>
              <span>opsi pembayaran</span>
            </div>
            <div>
              <strong>Tracking</strong>
              <span>progress produksi</span>
            </div>
          </div>
        </div>
        <div className="hero-media slide-pop">
          <video autoPlay loop muted playsInline poster="/assets/hasil.jpeg">
            <source src="/assets/proses 3d printing.mp4" type="video/mp4" />
            Browser kamu tidak mendukung video.
          </video>
          <div className="hero-card">
            <span>Live process</span>
            <strong>FDM 3D printing</strong>
          </div>
        </div>
      </section>

      <section className="ticker marquee" aria-label="Layanan utama">
        {["Konsultasi", "Estimasi", "DP / Full", "Produksi", "Finishing", "Pengiriman"].map(
          (item) => (
            <span key={item}>{item}</span>
          )
        )}
      </section>

      <section className="section services" id="layanan">
        <div className="section-heading">
          <p className="eyebrow">Layanan</p>
          <h2>Semua kebutuhan dari konsultasi sampai barang jadi.</h2>
        </div>
        <div className="service-grid reveal-grid">
          {services.map((service, index) => (
            <article key={service.title}>
              <span>0{index + 1}</span>
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section results" id="hasil">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Hasil cetak</p>
            <h2>Contoh output dari asset 3D printing yang tersedia.</h2>
          </div>
          <p>
            Galeri ini menampilkan hasil cetak dan bentuk akhir yang bisa
            menjadi referensi sebelum menentukan material, ukuran, dan finishing.
          </p>
        </div>
        <div className="gallery-grid reveal-grid">
          {gallery.map((item, index) => (
            <article className="gallery-card" key={item.title}>
              <MediaImage alt={item.title} fill src={item.src} />
              <div>
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section guide" id="panduan">
        <div className="guide-copy">
          <p className="eyebrow">Panduan material</p>
          <h2>Pilih filament sesuai fungsi, bukan hanya warna.</h2>
          <p>
            Setiap material punya karakter berbeda. Kami bantu rekomendasikan
            material berdasarkan fungsi part, beban, suhu, fleksibilitas, dan
            kebutuhan tampilan.
          </p>
          <ul className="reveal-list">
            {guides.map((guide) => (
              <li key={guide}>{guide}</li>
            ))}
          </ul>
        </div>
        <div className="guide-media slide-pop">
          <div className="image-frame landscape">
            <MediaImage
              alt="Panduan filament 3D printing"
              className="contain"
              fill
              src="/assets/3d printing filament guide.webp"
            />
          </div>
          <div className="image-frame landscape">
            <MediaImage
              alt="Jenis jenis filament 3D printing"
              className="contain"
              fill
              src="/assets/jenis-jenis filamen.webp"
            />
          </div>
        </div>
      </section>

      <section className="section process" id="proses">
        <div className="process-media slide-pop">
          <video controls preload="metadata" poster="/assets/hasil 4.jpeg">
            <source src="/assets/proses 3d printing 1.mp4" type="video/mp4" />
            Browser kamu tidak mendukung video.
          </video>
        </div>
        <div className="process-copy">
          <p className="eyebrow">Proses kerja</p>
          <h2>Alur order dibuat jelas sebelum mesin mulai jalan.</h2>
          <div className="step-list reveal-list">
            {steps.map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section finishing">
        <div className="image-frame portrait">
          <MediaImage
            alt="Finishing hasil 3D printing"
            fill
            src="/assets/hasil belum di finishing 3d printing.jpeg"
          />
        </div>
        <div>
          <p className="eyebrow">Finishing</p>
          <h2>Untuk produk yang perlu terlihat lebih rapi dan siap dipresentasikan.</h2>
          <p>
            Finishing membantu menyamarkan layer line, memperbaiki detail visual,
            dan memberi warna akhir sesuai referensi. Cocok untuk display
            produk, hadiah custom, properti foto, atau prototype yang akan
            ditunjukkan ke klien.
          </p>
        </div>
      </section>

      <section className="section order-section" id="order">
        <div className="order-copy">
          <p className="eyebrow">Form pembelian</p>
          <h2>Isi kebutuhanmu, lalu kirim langsung ke WhatsApp.</h2>
          <p>
            Form ini akan membuat pesan otomatis ke nomor 085691555890. Untuk
            file 3D, kirimkan setelah chat WhatsApp terbuka.
          </p>
        </div>
        <div className="slide-pop">
          <OrderForm />
        </div>
      </section>
    </main>
  );
}

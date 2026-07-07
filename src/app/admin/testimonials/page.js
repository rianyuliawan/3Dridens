import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { toggleTestimonialPublishedAction, deleteTestimonialAction } from "./actions";

export const metadata = {
  title: "Kelola Testimoni | Admin 3Dridens",
};

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, customer_name, role_or_context, rating, is_published")
    .order("created_at", { ascending: false });

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Testimoni</p>
        <h1>Kelola testimoni publik.</h1>
        <p>Tambah, edit, sembunyikan, atau hapus testimoni yang tampil di halaman /testimoni.</p>
      </section>

      <section className="system-panel">
        <div className="panel-heading">
          <span>+</span>
          <div>
            <h2>Testimoni</h2>
            <p>{(testimonials || []).length} testimoni</p>
          </div>
        </div>
        <Link className="primary-button" href="/admin/testimonials/new">
          Tambah Testimoni Baru
        </Link>
        <div className="admin-list">
          {(testimonials || []).map((item) => (
            <div className="admin-list-row" key={item.id}>
              <div>
                <strong>{item.customer_name}</strong>
                <span>
                  {item.role_or_context || "-"} · {"★".repeat(item.rating)}
                </span>
              </div>
              <div className="admin-list-meta">
                <span className={`status-pill ${item.is_published ? "is-success" : "is-pending"}`}>
                  {item.is_published ? "Tayang" : "Tersembunyi"}
                </span>
                <Link className="ghost-button" href={`/admin/testimonials/${item.id}`}>
                  Edit
                </Link>
                <form action={toggleTestimonialPublishedAction.bind(null, item.id, item.is_published)}>
                  <button className="secondary-button" type="submit">
                    {item.is_published ? "Sembunyikan" : "Tayangkan"}
                  </button>
                </form>
                <form action={deleteTestimonialAction.bind(null, item.id)}>
                  <button className="ghost-button" type="submit">
                    Hapus
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { togglePortfolioPublishedAction, deletePortfolioItemAction } from "./actions";

export const metadata = {
  title: "Kelola Portfolio | Admin 3Dridens",
};

export default async function AdminPortfolioPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("id, title, category, image_url, is_published, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Portfolio</p>
        <h1>Kelola galeri portfolio publik.</h1>
        <p>Tambah, edit, sembunyikan, atau hapus item yang tampil di halaman /portfolio.</p>
      </section>

      <section className="system-panel">
        <div className="panel-heading">
          <span>+</span>
          <div>
            <h2>Item portfolio</h2>
            <p>{(items || []).length} item</p>
          </div>
        </div>
        <Link className="primary-button" href="/admin/portfolio/new">
          Tambah Item Baru
        </Link>
        <div className="admin-list">
          {(items || []).map((item) => (
            <div className="admin-list-row" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.category || "Tanpa kategori"}</span>
              </div>
              <div className="admin-list-meta">
                <span className={`status-pill ${item.is_published ? "is-success" : "is-pending"}`}>
                  {item.is_published ? "Tayang" : "Tersembunyi"}
                </span>
                <Link className="ghost-button" href={`/admin/portfolio/${item.id}`}>
                  Edit
                </Link>
                <form action={togglePortfolioPublishedAction.bind(null, item.id, item.is_published)}>
                  <button className="secondary-button" type="submit">
                    {item.is_published ? "Sembunyikan" : "Tayangkan"}
                  </button>
                </form>
                <form action={deletePortfolioItemAction.bind(null, item.id)}>
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

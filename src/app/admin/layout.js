import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionProfile } from "@/lib/supabase/profile";
import { signOutAction } from "@/app/auth/actions";

export const metadata = {
  title: "Admin | 3Dridens",
  description: "Kelola konsultasi, order, pembayaran, dan konten 3Dridens.",
};

export default async function AdminLayout({ children }) {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="system-app">
      <aside className="system-sidebar">
        <Link className="brand" href="/">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <nav className="system-nav" aria-label="Navigasi admin">
          <Link href="/admin">Ringkasan</Link>
          <Link href="/admin/consultations">Konsultasi</Link>
          <Link href="/admin/orders">Order</Link>
          <Link href="/admin/portfolio">Portfolio</Link>
          <Link href="/admin/testimonials">Testimoni</Link>
        </nav>
        <div className="system-status">
          <span className="role-badge">Admin</span>
          <strong>{profile?.full_name || user.email}</strong>
          <form action={signOutAction}>
            <button className="ghost-button" type="submit">
              Keluar
            </button>
          </form>
        </div>
      </aside>
      <main className="system-main">{children}</main>
    </div>
  );
}

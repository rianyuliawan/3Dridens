import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionProfile } from "@/lib/supabase/profile";
import { signOutAction } from "@/app/auth/actions";

export const metadata = {
  title: "Dashboard | 3Dridens",
  description: "Pantau konsultasi, order, pembayaran, dan progress project kamu.",
};

export default async function DashboardLayout({ children }) {
  const { user, profile } = await getSessionProfile();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  return (
    <div className="system-app">
      <aside className="system-sidebar">
        <Link className="brand" href="/">
          <span>3D</span>
          <strong>3Dridens</strong>
        </Link>
        <nav className="system-nav" aria-label="Navigasi customer">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/consultation/new">Konsultasi Baru</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/testimoni">Testimoni</Link>
        </nav>
        <div className="system-status">
          <span className="role-badge">Customer</span>
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

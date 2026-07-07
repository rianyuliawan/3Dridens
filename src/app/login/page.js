import LoginForm from "./LoginForm";

export const metadata = {
  title: "Masuk | 3Dridens",
  description: "Masuk ke akun 3Dridens untuk memantau konsultasi dan order kamu.",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const next = typeof params?.next === "string" ? params.next : "";

  return (
    <main className="auth-shell">
      <LoginForm next={next} />
    </main>
  );
}

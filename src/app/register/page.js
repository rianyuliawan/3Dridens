import RegisterForm from "./RegisterForm";

export const metadata = {
  title: "Daftar | 3Dridens",
  description: "Buat akun 3Dridens untuk mulai konsultasi project 3D printing kamu.",
};

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <RegisterForm />
    </main>
  );
}

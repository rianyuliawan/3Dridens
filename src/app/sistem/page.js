import WorkflowDashboard from "./WorkflowDashboard";

export const metadata = {
  title: "Sistem Order | 3Dridens",
  description:
    "Dashboard alur order 3Dridens dari konsultasi, estimasi biaya, pembayaran DP atau full, progress produksi, sampai pengiriman.",
};

export default function SystemPage() {
  return <WorkflowDashboard />;
}

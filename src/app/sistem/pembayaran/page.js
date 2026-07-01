import PaymentProcessClient from "./PaymentProcessClient";

export const metadata = {
  title: "Pembayaran Order | 3Dridens",
  description:
    "Halaman admin untuk melihat status pembayaran DP atau full, konfirmasi bukti, dan menyelesaikan order.",
};

export default function PaymentProcessPage() {
  return <PaymentProcessClient />;
}

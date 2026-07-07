import PortfolioForm from "../PortfolioForm";
import { createPortfolioItemAction } from "../actions";

export const metadata = {
  title: "Tambah Portfolio | Admin 3Dridens",
};

export default function NewPortfolioItemPage() {
  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Portfolio</p>
        <h1>Tambah item portfolio baru.</h1>
      </section>
      <PortfolioForm action={createPortfolioItemAction} submitLabel="Tambah Item" />
    </>
  );
}

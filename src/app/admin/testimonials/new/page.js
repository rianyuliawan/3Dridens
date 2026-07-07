import TestimonialForm from "../TestimonialForm";
import { createTestimonialAction } from "../actions";

export const metadata = {
  title: "Tambah Testimoni | Admin 3Dridens",
};

export default function NewTestimonialPage() {
  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Testimoni</p>
        <h1>Tambah testimoni baru.</h1>
      </section>
      <TestimonialForm action={createTestimonialAction} submitLabel="Tambah Testimoni" />
    </>
  );
}

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestimonialForm from "../TestimonialForm";
import { updateTestimonialAction } from "../actions";

export const metadata = {
  title: "Edit Testimoni | Admin 3Dridens",
};

export default async function EditTestimonialPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("testimonials")
    .select("id, customer_name, role_or_context, quote, rating")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const action = updateTestimonialAction.bind(null, id);

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Testimoni</p>
        <h1>Edit: {item.customer_name}</h1>
      </section>
      <TestimonialForm
        action={action}
        defaultValues={{
          customerName: item.customer_name,
          roleOrContext: item.role_or_context,
          quote: item.quote,
          rating: item.rating,
        }}
        submitLabel="Simpan Perubahan"
      />
    </>
  );
}

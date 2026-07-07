import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PortfolioForm from "../PortfolioForm";
import { updatePortfolioItemAction } from "../actions";

export const metadata = {
  title: "Edit Portfolio | Admin 3Dridens",
};

export default async function EditPortfolioItemPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("id, title, category, description, image_url, sort_order")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const action = updatePortfolioItemAction.bind(null, id);

  return (
    <>
      <section className="system-hero slide-group">
        <p className="eyebrow">Portfolio</p>
        <h1>Edit: {item.title}</h1>
      </section>
      <PortfolioForm
        action={action}
        defaultValues={{
          title: item.title,
          category: item.category,
          description: item.description,
          imageUrl: item.image_url,
          sortOrder: item.sort_order,
        }}
        submitLabel="Simpan Perubahan"
      />
    </>
  );
}

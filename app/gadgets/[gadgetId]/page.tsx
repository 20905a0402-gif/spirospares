// ISR: Revalidate every 60 seconds to pick up Sanity changes
export const revalidate = 60;

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GadgetCard from "@/components/cards/GadgetCard";
import GadgetProductDetail from "@/components/pdp/GadgetProductDetail";
import { formatKES } from "@/lib/data";
import { getLegacyGadgetById, getLegacyGadgets } from "@/lib/sanity/queries-data";

type GadgetDetailPageProps = {
  params: {
    gadgetId: string;
  };
};

export async function generateStaticParams() {
  const gadgets = await getLegacyGadgets();
  return gadgets.map((gadget) => ({ gadgetId: gadget.id }));
}

export async function generateMetadata({ params }: GadgetDetailPageProps): Promise<Metadata> {
  const gadget = await getLegacyGadgetById(params.gadgetId);

  if (!gadget) {
    return { title: "Gadget Not Found" };
  }

  return {
    title: `${gadget.name} - Spiro Gadgets`,
    description: `${gadget.name} for Spiro riders in Kenya. ${gadget.compatibility}. Price: ${formatKES(gadget.price)}.`
  };
}

export default async function GadgetDetailPage({ params }: GadgetDetailPageProps) {
  const gadget = await getLegacyGadgetById(params.gadgetId);

  if (!gadget) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: gadget.name,
    brand: "Spiro",
    description: gadget.features.join(". "),
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: gadget.price,
      availability: (gadget.stock ?? 1) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

  const similarGadgets = (await getLegacyGadgets())
    .filter((candidate) => candidate.id !== gadget.id && candidate.category === gadget.category)
    .slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />

      <section className="container-shell pt-4">
        <nav aria-label="Breadcrumb" className="text-xs uppercase tracking-[0.16em] text-gray-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-[#00BFFF]">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/gadgets" className="transition hover:text-[#00BFFF]">
                Gadgets
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-400">{gadget.name}</li>
          </ol>
        </nav>
      </section>

      <GadgetProductDetail gadget={gadget} />

      <section className="container-shell pb-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">Similar Gadgets</h2>
        <div className="similar-products-grid mt-4">
          {similarGadgets.map((similarGadget) => (
            <GadgetCard key={similarGadget.id} gadget={similarGadget} compact />
          ))}
        </div>
      </section>
    </>
  );
}
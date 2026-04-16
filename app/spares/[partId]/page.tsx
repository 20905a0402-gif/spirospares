import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SpareCard from "@/components/cards/SpareCard";
import SpareProductDetail from "@/components/pdp/SpareProductDetail";
import { formatKES } from "@/lib/data";
import { getLegacySparePartById, getLegacySpareParts } from "@/lib/sanity/queries-data";

type SpareDetailPageProps = {
  params: {
    partId: string;
  };
};

export async function generateStaticParams() {
  const parts = await getLegacySpareParts();
  return parts.map((part) => ({ partId: part.id }));
}

export async function generateMetadata({ params }: SpareDetailPageProps): Promise<Metadata> {
  const part = await getLegacySparePartById(params.partId);

  if (!part) {
    return { title: "Spare Part Not Found" };
  }

  const leadModel = part.compatible_models[0] ?? "model";

  return {
    title: `${part.name} for Spiro ${leadModel} - Spares Nairobi`,
    description: `${part.name} (${part.part_code}) compatible with ${part.compatible_models.join(
      ", "
    )}. Price: ${formatKES(part.price)}. Genuine Spiro spares Kenya with fast fulfillment.`
  };
}

export default async function SpareDetailPage({ params }: SpareDetailPageProps) {
  const part = await getLegacySparePartById(params.partId);

  if (!part) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    sku: part.part_code,
    brand: "Spiro",
    description: part.function,
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: part.price,
      availability: "https://schema.org/InStock"
    }
  };

  const similarParts = (await getLegacySpareParts())
    .filter((candidate) => candidate.id !== part.id && candidate.category === part.category)
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
              <Link href="/spares" className="transition hover:text-[#00BFFF]">
                Spares
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-400">{part.name}</li>
          </ol>
        </nav>
      </section>

      <SpareProductDetail part={part} />

      <section className="container-shell pb-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">Similar Spares</h2>
        <div className="catalog-grid-compact mt-4">
          {similarParts.map((similarPart) => (
            <SpareCard key={similarPart.id} part={similarPart} compact />
          ))}
        </div>
      </section>
    </>
  );
}
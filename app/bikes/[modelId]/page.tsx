import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BikeCard from "@/components/cards/BikeCard";
import BikeProductDetail from "@/components/pdp/BikeProductDetail";
import { formatKES } from "@/lib/data";
import { getLegacyBikeById, getLegacyBikes, getLegacyGadgets } from "@/lib/sanity/queries-data";

type BikeDetailPageProps = {
  params: {
    modelId: string;
  };
};

export async function generateStaticParams() {
  const bikes = await getLegacyBikes();
  return bikes.map((bike) => ({ modelId: bike.id }));
}

export async function generateMetadata({ params }: BikeDetailPageProps): Promise<Metadata> {
  const bike = await getLegacyBikeById(params.modelId);

  if (!bike) {
    return {
      title: "Bike Not Found"
    };
  }

  return {
    title: `${bike.name} - Spiro Bike Nairobi`,
    description: `${bike.name} (${bike.SKU}) now available at ${formatKES(
      bike.price
    )}. Built for battery swapping network performance and downtime reduction for delivery riders in Nairobi.`
  };
}

export default async function BikeDetailPage({ params }: BikeDetailPageProps) {
  const bike = await getLegacyBikeById(params.modelId);

  if (!bike) {
    notFound();
  }

  const [allGadgets, allBikes] = await Promise.all([
    getLegacyGadgets(),
    getLegacyBikes(),
  ]);

  const relatedGadgets = allGadgets.slice(0, 6);
  const similarBikes = allBikes.filter((candidate) => candidate.id !== bike.id).slice(0, 6);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: bike.name,
    sku: bike.SKU,
    description: bike.short_description,
    brand: "Spiro",
    offers: {
      "@type": "Offer",
      priceCurrency: "KES",
      price: bike.price,
      availability: bike.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  };

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
              <Link href="/bikes" className="transition hover:text-[#00BFFF]">
                Bikes
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-400">{bike.name}</li>
          </ol>
        </nav>
      </section>

      <BikeProductDetail bike={bike} relatedGadgets={relatedGadgets} />

      <section className="container-shell pb-10">
        <h2 className="text-2xl font-bold tracking-tight text-white">Similar Bikes</h2>
        <div className="similar-products-grid mt-4">
          {similarBikes.map((similarBike) => (
            <BikeCard key={similarBike.id} bike={similarBike} compact />
          ))}
        </div>
      </section>
    </>
  );
}
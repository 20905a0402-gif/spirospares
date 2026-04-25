import { Suspense } from "react";
import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import SparesCatalog from "@/components/sections/SparesCatalog";
import { homeAndSparesModelTargets } from "@/lib/modelTargets";
import { getLegacyBikes, getLegacySpareParts } from "@/lib/sanity/queries-data";

export const metadata: Metadata = {
  title: "Spares",
  description:
    "Spiro spares in Kenya with fast-moving inventory and model-based compatibility filtering for delivery riders and fleet teams."
};

export default async function SparesPage() {
  const [bikes, spareParts] = await Promise.all([getLegacyBikes(), getLegacySpareParts()]);

  const modelFilters = homeAndSparesModelTargets.map((target) => ({
    label: target.label,
    matchTokens: [...target.searchTokens, ...(target.fallbackTokens ?? [])]
  }));

  return (
    <>
      <HeroBanner
        title="Spiro Spares in Kenya"
        subtitle="Shop high-turnover components engineered for faster repairs, lower downtime, and sustained rider productivity."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Spares" }]}
      />

      <Suspense fallback={<section className="container-shell py-10"><div className="panel p-6 text-center text-gray-400">Loading spare catalog...</div></section>}>
        <SparesCatalog parts={spareParts} modelNames={bikes.map((bike) => bike.name)} modelFilters={modelFilters} />
      </Suspense>
    </>
  );
}
import { Suspense } from "react";
import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import SearchResultsPanel from "@/components/sections/SearchResultsPanel";

export const metadata: Metadata = {
  title: "Search",
  description: "Search bikes, spares, gadgets, services, and categories in one place."
};
export default function SearchPage() {
  return (
    <>
      <HeroBanner
        title="Search Results"
        subtitle="Find products, categories, and service locations from one search experience."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />

      <Suspense fallback={<section className="container-shell py-10"><div className="panel p-6 text-center text-gray-400">Loading search results...</div></section>}>
        <SearchResultsPanel />
      </Suspense>
    </>
  );
}

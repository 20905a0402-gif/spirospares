"use client";

import { useMemo, useState } from "react";
import { Bike, SparePart, SparePartCategory } from "@/lib/data";
import SpareCard from "@/components/cards/SpareCard";

type ModelSparesCatalogProps = {
  bike: Bike;
  parts: SparePart[];
};

const categories: Array<"All" | SparePartCategory> = [
  "All",
  "Body & Trim",
  "Frame & Suspension",
  "General",
  "Electrical"
];

export default function ModelSparesCatalog({ bike, parts }: ModelSparesCatalogProps) {
  const [activeCategory, setActiveCategory] = useState<"All" | SparePartCategory>("All");

  const filteredParts = useMemo(() => {
    if (activeCategory === "All") {
      return parts;
    }

    return parts.filter((part) => part.category === activeCategory);
  }, [activeCategory, parts]);

  return (
    <section className="container-shell py-10">
      <header className="panel relative mb-8 overflow-hidden px-6 py-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/8 via-transparent to-[#4B5563]/10" />
        <h1 className="relative text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Fast-Moving Spares for {bike.name}
        </h1>
        <p className="relative mt-2 max-w-3xl text-gray-400">
          Browse high-turnover inventory built to support battery swapping network efficiency and downtime reduction for riders.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="h-fit md:sticky md:top-28">
          <div className="glass-panel rounded-2xl p-5">
            <h2 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
              Filter by Subcategories
            </h2>
            <div className="mt-4 flex flex-col gap-2">
              {categories.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-xl border-l-2 px-4 py-2 text-left text-sm font-bold transition-all duration-300 ease-out ${
                      isActive
                        ? "border-l-[#00BFFF] border-white/10 bg-white/5 text-[#00BFFF]"
                        : "border-l-transparent border-white/10 bg-transparent text-gray-300 hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div>
          <h2 className="mb-4 text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
            {filteredParts.length} Compatible Parts
          </h2>
          <div className="catalog-grid">
            {filteredParts.map((part) => (
              <SpareCard key={part.id} part={part} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import GadgetCard from "@/components/cards/GadgetCard";
import { Gadget } from "@/lib/data";

type GadgetsSortOption = "popular" | "price-low" | "price-high" | "discount";

type GadgetsCatalogProps = {
  items: Gadget[];
};

const getDiscountScore = (id: string) =>
  id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 24;

export default function GadgetsCatalog({ items }: GadgetsCatalogProps) {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<GadgetsSortOption>("popular");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category)));
    return ["All", ...unique] as Array<"All" | Gadget["category"]>;
  }, [items]);

  const selectedCategory = (searchParams.get("category") ?? "").trim().toLowerCase();
  const resolvedInitialCategory = useMemo(
    () =>
      categories.find(
        (category) => category !== "All" && category.toLowerCase() === selectedCategory
      ) ?? "All",
    [categories, selectedCategory]
  );

  const [activeCategory, setActiveCategory] = useState<"All" | Gadget["category"]>(resolvedInitialCategory);

  useEffect(() => {
    setActiveCategory(resolvedInitialCategory);
  }, [resolvedInitialCategory]);

  const filteredItems = useMemo(() => {
    const byCategory = activeCategory === "All" ? items : items.filter((item) => item.category === activeCategory);

    return [...byCategory].sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "discount") {
        return getDiscountScore(b.id) - getDiscountScore(a.id);
      }

      const popularityA = a.features.length * 8 + a.name.length;
      const popularityB = b.features.length * 8 + b.name.length;
      return popularityB - popularityA;
    });
  }, [activeCategory, items, sortBy]);

  return (
    <section className="container-shell py-8">
      <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit md:sticky md:top-28">
          <div className="glass-panel rounded-2xl p-4">
            <h2 className="text-base font-bold tracking-tight text-white">Filter by Subcategories</h2>
            <div className="mt-3 flex flex-col gap-1.5">
              {categories.map((category) => {
                const isActive = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg border-l-2 px-3 py-1.5 text-left text-xs font-bold transition-all duration-300 ease-out md:text-sm ${
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-300">
              Showing <span className="font-semibold text-white">{filteredItems.length}</span> gadgets
            </p>
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              Sort By
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as GadgetsSortOption)}
                className="rounded-lg border border-white/15 bg-[#0f0f0f] px-3 py-2 text-sm text-white focus:border-[#00BFFF]/60 focus:outline-none"
              >
                <option value="popular">Popular</option>
                <option value="price-low">low-high</option>
                <option value="price-high">high-low</option>
                <option value="discount">Discount</option>
              </select>
            </label>
          </div>

          <div className="catalog-grid-compact">
            {filteredItems.map((gadget) => (
              <GadgetCard key={gadget.id} gadget={gadget} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


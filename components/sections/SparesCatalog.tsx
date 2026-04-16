"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Bike, SparePart, SparePartCategory } from "@/lib/data";
import SpareCard from "@/components/cards/SpareCard";

type SparesSortOption = "popular" | "price-low" | "price-high" | "discount";

type SparesCatalogProps = {
  parts: SparePart[];
  modelNames: Bike["name"][];
};

const categories: Array<"All" | SparePartCategory> = [
  "All",
  "Body & Trim",
  "Frame & Suspension",
  "General",
  "Electrical"
];

const getDiscountScore = (partId: string) =>
  partId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;

const normalizeModel = (value: string) => value.trim().toUpperCase();

export default function SparesCatalog({ parts, modelNames }: SparesCatalogProps) {
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<SparesSortOption>("popular");
  const [isModelMenuFocused, setIsModelMenuFocused] = useState(false);

  const modelOptions = useMemo(() => ["All Spares", ...modelNames], [modelNames]);

  const selectedCategory = searchParams.get("category") ?? "";
  const normalizedCategory = normalizeModel(selectedCategory);
  const resolvedInitialCategory =
    categories.find(
      (category) => category !== "All" && normalizeModel(category) === normalizedCategory
    ) ?? "All";

  const [activeCategory, setActiveCategory] = useState<"All" | SparePartCategory>(resolvedInitialCategory);

  const selectedModel = searchParams.get("model") ?? "";
  const normalizedInitial = normalizeModel(selectedModel);
  const resolvedInitialModel =
    modelNames.find((model) => normalizeModel(model) === normalizedInitial) ?? "All Spares";

  const [activeModel, setActiveModel] = useState<string>(resolvedInitialModel);

  useEffect(() => {
    setActiveModel(resolvedInitialModel);
  }, [resolvedInitialModel]);

  useEffect(() => {
    setActiveCategory(resolvedInitialCategory);
  }, [resolvedInitialCategory]);

  const filteredParts = useMemo(() => {
    const byCategory =
      activeCategory === "All" ? parts : parts.filter((part) => part.category === activeCategory);

    const byModel =
      activeModel === "All Spares"
        ? byCategory
        : byCategory.filter((part) => part.compatible_models.includes(activeModel as Bike["name"]));

    return [...byModel].sort((a, b) => {
      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "discount") {
        return getDiscountScore(b.id) - getDiscountScore(a.id);
      }

      const popularityA = a.stock + a.compatible_models.length * 12;
      const popularityB = b.stock + b.compatible_models.length * 12;
      return popularityB - popularityA;
    });
  }, [activeCategory, activeModel, parts, sortBy]);

  return (
    <section className="container-shell py-8">
      <div className="panel p-4 md:p-5">
        <h2 className="text-lg font-bold tracking-tight text-white">Select a bike model to instantly view only compatible spares</h2>
        <div className="mt-3 md:hidden">
          <label htmlFor="mobile-bike-model" className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            Bike Model
          </label>
          <div className="relative mt-2">
            <select
              id="mobile-bike-model"
              value={activeModel}
              onFocus={() => setIsModelMenuFocused(true)}
              onBlur={() => setIsModelMenuFocused(false)}
              onChange={(event) => setActiveModel(event.target.value)}
              className="w-full appearance-none rounded-xl border border-white/15 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-700 transition-all duration-300 ease-out focus:border-[#00BFFF]/70 focus:outline-none"
            >
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-all duration-300 ${
                isModelMenuFocused
                  ? "rotate-180 text-[#00BFFF]"
                  : "animate-subtle-bounce text-gray-400"
              }`}
            />
          </div>
        </div>

        <div className="mt-4 hidden gap-2 overflow-x-auto pb-1 md:flex">
          {modelOptions.map((model) => {
            const isActive = model === activeModel;
            return (
              <button
                key={model}
                type="button"
                onClick={() => setActiveModel(model)}
                className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ease-out ${
                  isActive
                    ? "border-[#00BFFF]/70 bg-[#00BFFF]/15 text-[#00BFFF]"
                    : "border-white/15 bg-white/5 text-gray-300 hover:border-[#00BFFF]/50 hover:text-white"
                }`}
              >
                {model}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-fit md:sticky md:top-28">
          <div className="glass-panel rounded-2xl p-4">
            <h3 className="text-base font-bold tracking-tight text-white">Filter by Subcategories</h3>
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
              Showing <span className="font-semibold text-white">{filteredParts.length}</span> parts for
              <span className="ml-1 font-semibold text-white">{activeModel}</span>
            </p>
            <label className="inline-flex items-center gap-2 text-sm text-gray-300">
              Sort By
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as SparesSortOption)}
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
            {filteredParts.map((part) => (
              <SpareCard key={part.id} part={part} compact />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


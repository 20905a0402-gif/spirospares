"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatKES } from "@/lib/data";
import { searchCatalog } from "@/lib/search";

const getTypeLabel = (type: string) => {
  if (type === "subcategory") return "Subcategory";
  if (type === "service") return "Service Center";
  if (type === "page") return "Page";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function SearchResultsPanel() {
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const results = query ? searchCatalog(query, 120) : [];

  return (
    <section className="container-shell py-8 md:py-10">
      <div className="panel p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Search Query</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
          {query ? `"${query}"` : "Type in the top search bar to begin"}
        </h1>
        {query ? (
          <p className="mt-2 text-sm text-gray-400">
            Found <span className="font-semibold text-white">{results.length}</span> matching items.
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3">
        {query && results.length === 0 ? (
          <div className="panel p-6 text-sm text-gray-400">No matches found. Try product name, category, SKU, or city.</div>
        ) : null}

        {results.map((result) => (
          <Link
            key={result.id}
            href={result.href}
            className="panel flex items-center justify-between gap-4 p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#00BFFF]/45"
          >
            <div>
              <p className="text-base font-bold text-white">{result.title}</p>
              <p className="mt-1 text-sm text-gray-500">{result.subtitle}</p>
              {typeof result.price === "number" ? (
                <p className="mt-1 text-sm font-semibold text-[#8A6200]">{formatKES(result.price)}</p>
              ) : null}
            </div>
            <span className="inline-flex rounded-full border border-[#00BFFF]/35 bg-[#00BFFF]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-[#0086B5]">
              {getTypeLabel(result.type)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

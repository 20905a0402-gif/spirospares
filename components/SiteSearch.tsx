"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles } from "lucide-react";
import { searchCatalog } from "@/lib/search";

type SiteSearchProps = {
  mobile?: boolean;
};

const getTypeLabel = (type: string) => {
  if (type === "subcategory") return "Subcategory";
  if (type === "service") return "Service Center";
  if (type === "page") return "Page";
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function SiteSearch({ mobile = false }: SiteSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const liveResults = useMemo(() => searchCatalog(query, 8), [query]);
  const showDropdown = isFocused && query.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    setIsFocused(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const selectResult = (href: string) => {
    setIsFocused(false);
    setQuery("");
    router.push(href);
  };

  return (
    <div ref={rootRef} className={`relative ${mobile ? "w-full" : "w-full"}`}>
      <form onSubmit={submitSearch} className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search bikes, spares, and gadgets..."
          className={`w-full rounded-full border border-white/20 bg-white px-10 py-3.5 text-sm text-slate-700 placeholder:text-gray-500 transition-all duration-300 ease-out focus:border-[#00BFFF]/70 focus:outline-none ${
            mobile ? "shadow-sm" : "shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
          }`}
        />
      </form>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[70] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_16px_30px_rgba(15,23,42,0.15)]">
          {liveResults.length > 0 ? (
            <ul className="max-h-[360px] overflow-y-auto py-2">
              {liveResults.map((result) => (
                <li key={result.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectResult(result.href)}
                    className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-[#f7fbff]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{result.title}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{result.subtitle}</p>
                    </div>
                    <span className="inline-flex rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0086B5]">
                      {getTypeLabel(result.type)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-5 text-sm text-gray-500">
              <p>No direct matches found.</p>
              <p className="mt-1">Try product name, SKU, category, or location.</p>
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-white/10 px-4 py-2 text-xs text-gray-500">
            <Sparkles className="h-3.5 w-3.5 text-[#EAB308]" />
            Showing live suggestions while you type.
          </div>
        </div>
      ) : null}
    </div>
  );
}

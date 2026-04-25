import { bikes, gadgets, spareParts } from "@/lib/data";

export type SearchItemType = "bike" | "spare" | "gadget" | "subcategory" | "page";

export type SearchResult = {
  id: string;
  type: SearchItemType;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  price?: number;
  searchable: string;
};

const staticPages: SearchResult[] = [
  {
    id: "page-home",
    type: "page",
    title: "Home",
    subtitle: "Main storefront",
    href: "/",
    searchable: "home main storefront"
  }
];

const spareSubcategories = Array.from(new Set(spareParts.map((part) => part.category))).map((category) => ({
  id: `subcategory-spares-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  type: "subcategory" as const,
  title: category,
  subtitle: "Spares subcategory",
  href: `/spares?category=${encodeURIComponent(category)}`,
  searchable: `${category} spares spare parts subcategory`
}));

const gadgetSubcategories = Array.from(new Set(gadgets.map((gadget) => gadget.category))).map((category) => ({
  id: `subcategory-gadgets-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
  type: "subcategory" as const,
  title: category,
  subtitle: "Gadgets subcategory",
  href: `/gadgets?category=${encodeURIComponent(category)}`,
  searchable: `${category} gadgets accessories subcategory`
}));

const bikeItems: SearchResult[] = bikes.map((bike) => ({
  id: `bike-${bike.id}`,
  type: "bike",
  title: bike.name,
  subtitle: `${bike.category} • ${bike.SKU}`,
  href: `/bikes/${bike.id}`,
  image: bike.images[0],
  price: bike.price,
  searchable: `${bike.name} ${bike.category} ${bike.SKU} ${bike.short_description} ${bike.motor} ${bike.range} ${bike.battery}`.toLowerCase()
}));

const spareItems: SearchResult[] = spareParts.map((part) => ({
  id: `spare-${part.id}`,
  type: "spare",
  title: part.name,
  subtitle: `${part.category} • ${part.part_code}`,
  href: `/spares/${part.id}`,
  image: part.image,
  price: part.price,
  searchable: `${part.name} ${part.part_code} ${part.category} ${part.compatible_models.join(" ")} ${part.function}`.toLowerCase()
}));

const gadgetItems: SearchResult[] = gadgets.map((gadget) => ({
  id: `gadget-${gadget.id}`,
  type: "gadget",
  title: gadget.name,
  subtitle: `${gadget.category}`,
  href: `/gadgets/${gadget.id}`,
  image: gadget.images[0],
  price: gadget.price,
  searchable: `${gadget.name} ${gadget.category} ${gadget.compatibility} ${gadget.features.join(" ")}`.toLowerCase()
}));

export const SEARCH_INDEX: SearchResult[] = [
  ...bikeItems,
  ...spareItems,
  ...gadgetItems,
  ...spareSubcategories,
  ...gadgetSubcategories,
  ...staticPages
];

const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ");

const getScore = (item: SearchResult, query: string, tokens: string[]) => {
  const title = normalize(item.title);
  const haystack = `${title} ${item.searchable}`;

  let score = 0;

  if (title === query) {
    score += 120;
  }

  if (title.startsWith(query)) {
    score += 90;
  } else if (haystack.includes(query)) {
    score += 35;
  }

  for (const token of tokens) {
    if (!haystack.includes(token)) {
      return 0;
    }

    if (title.startsWith(token)) {
      score += 24;
    } else {
      score += 8;
    }
  }

  if (item.type === "subcategory") {
    score += 4;
  }

  return score;
};

export const searchCatalog = (query: string, limit = 60): SearchResult[] => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(" ").filter(Boolean);

  return SEARCH_INDEX
    .map((item) => ({ item, score: getScore(item, normalizedQuery, tokens) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.item.title.localeCompare(b.item.title);
    })
    .slice(0, limit)
    .map((entry) => entry.item);
};

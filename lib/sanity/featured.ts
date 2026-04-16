import groq from "groq";
import { type Gadget, type SparePart } from "@/lib/data";
import { sanityFetch } from "@/lib/sanity/client";

type HomepageFeaturedProducts = {
  spares: SparePart[];
  gadgets: Gadget[];
};

type RawSpare = {
  _id?: string;
  _type?: string;
  name?: string;
  part_code?: string;
  partCode?: string;
  sku?: string;
  price?: number;
  category?: string;
  compatible_models?: string[];
  compatibleModels?: string[];
  function?: string;
  replacement_cycle?: string;
  replacementCycle?: string;
  stock?: number;
  imageUrl?: string;
  material?: string;
  quality?: string;
};

type RawGadget = {
  _id?: string;
  _type?: string;
  name?: string;
  price?: number;
  category?: string;
  imageUrl?: string;
  features?: string[];
  compatibility?: string;
  technical_details?: string;
  technicalDetails?: string;
};

const SPARE_FALLBACK_IMAGE = "/images/spares/Drive%20Chain%20(Complete%20Loop).png";
const GADGET_FALLBACK_IMAGE = "/images/gadgets/Smart%20Quad%20Phone%20Holde.png";

const allowedSpareCategories = [
  "Body & Trim",
  "Frame & Suspension",
  "General",
  "Electrical"
] as const;

const allowedGadgetCategories = [
  "Phone holders",
  "Chargers",
  "Safety",
  "Security"
] as const;

const normalizeSpareCategory = (value: string | undefined): SparePart["category"] => {
  const normalized = (value ?? "").trim().toLowerCase();

  if (normalized.includes("body")) return "Body & Trim";
  if (normalized.includes("suspension") || normalized.includes("frame")) return "Frame & Suspension";
  if (normalized.includes("elect")) return "Electrical";

  return "General";
};

const normalizeGadgetCategory = (value: string | undefined): Gadget["category"] => {
  const normalized = (value ?? "").trim().toLowerCase();

  if (normalized.includes("holder") || normalized.includes("phone")) return "Phone holders";
  if (normalized.includes("charge")) return "Chargers";
  if (normalized.includes("safe") || normalized.includes("helmet")) return "Safety";

  return "Security";
};

const ensureSpareCategory = (category: SparePart["category"]): SparePart["category"] =>
  allowedSpareCategories.includes(category) ? category : "General";

const ensureGadgetCategory = (category: Gadget["category"]): Gadget["category"] =>
  allowedGadgetCategories.includes(category) ? category : "Security";

const toSpare = (item: RawSpare, index: number): SparePart | null => {
  if (!item.name) {
    return null;
  }

  const mappedCategory = ensureSpareCategory(normalizeSpareCategory(item.category));
  const mappedCode = item.part_code ?? item.partCode ?? item.sku ?? `SAN-SP-${String(index + 1).padStart(3, "0")}`;

  return {
    id: item._id ?? `sanity-spare-${index + 1}`,
    name: item.name,
    part_code: mappedCode,
    price: Number(item.price ?? 0),
    category: mappedCategory,
    compatible_models: (item.compatible_models ?? item.compatibleModels ?? []) as SparePart["compatible_models"],
    function: item.function ?? "Genuine spare part for reliable daily EV operations.",
    replacement_cycle: item.replacement_cycle ?? item.replacementCycle ?? "Inspect periodically based on usage conditions.",
    stock: Number(item.stock ?? 0),
    image: item.imageUrl ?? SPARE_FALLBACK_IMAGE,
    material: item.material ?? "OEM-grade material",
    quality: item.quality ?? "Quality checked"
  };
};

const toGadget = (item: RawGadget, index: number): Gadget | null => {
  if (!item.name) {
    return null;
  }

  const mappedCategory = ensureGadgetCategory(normalizeGadgetCategory(item.category));

  return {
    id: item._id ?? `sanity-gadget-${index + 1}`,
    name: item.name,
    price: Number(item.price ?? 0),
    images: [item.imageUrl ?? GADGET_FALLBACK_IMAGE],
    features: item.features?.length ? item.features : ["Sanity-managed gadget feature"],
    compatibility: item.compatibility ?? "Compatible with supported Spiro bike lineup",
    category: mappedCategory,
    technical_details: item.technical_details ?? item.technicalDetails ?? "Technical details available on request"
  };
};

const featuredSparesQuery = groq`*[_type in ["spare", "sparePart"] && defined(name)] | order(_updatedAt desc)[0...$limit]{
  _id,
  _type,
  name,
  part_code,
  partCode,
  sku,
  price,
  category,
  compatible_models,
  compatibleModels,
  function,
  replacement_cycle,
  replacementCycle,
  stock,
  material,
  quality,
  "imageUrl": coalesce(image.asset->url, images[0].asset->url, imageUrl)
}`;

const featuredGadgetsQuery = groq`*[_type in ["gadget", "smartGadget"] && defined(name)] | order(_updatedAt desc)[0...$limit]{
  _id,
  _type,
  name,
  price,
  category,
  features,
  compatibility,
  technical_details,
  technicalDetails,
  "imageUrl": coalesce(image.asset->url, images[0].asset->url, imageUrl)
}`;

export async function getHomepageFeaturedProducts(
  limits: { sparesLimit: number; gadgetsLimit: number }
): Promise<HomepageFeaturedProducts | null> {
  const [rawSpares, rawGadgets] = await Promise.all([
    sanityFetch<RawSpare[]>(featuredSparesQuery, { limit: limits.sparesLimit }),
    sanityFetch<RawGadget[]>(featuredGadgetsQuery, { limit: limits.gadgetsLimit })
  ]);

  const spares = (rawSpares ?? []).map(toSpare).filter((item): item is SparePart => Boolean(item));
  const gadgets = (rawGadgets ?? []).map(toGadget).filter((item): item is Gadget => Boolean(item));

  if (!spares.length && !gadgets.length) {
    return null;
  }

  return { spares, gadgets };
}

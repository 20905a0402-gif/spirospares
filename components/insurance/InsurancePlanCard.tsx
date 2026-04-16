"use client";

import Link from "next/link";
import { Heart, MessageCircle, ShoppingCart, FileText } from "lucide-react";
import { useShopStore } from "@/lib/store";

type InsurancePlanCardProps = {
  title: string;
  audience: string;
  covered: string[];
  excluded: string[];
};

const basePriceByPlanTitle = (title: string) => {
  if (title.toLowerCase().includes("comprehensive") && title.toLowerCase().includes("psv")) return 9800;
  if (title.toLowerCase().includes("comprehensive")) return 7400;
  if (title.toLowerCase().includes("psv")) return 6200;
  return 4500;
};

export default function InsurancePlanCard({ title, audience, covered, excluded }: InsurancePlanCardProps) {
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const isWishlisted = useShopStore((state) => state.isWishlisted(title, "insurance"));

  const estimatedPrice = basePriceByPlanTitle(title);
  const encodedPlan = encodeURIComponent(title);
  const whatsappMessage = encodeURIComponent(
    `Hello SPIRO SPARES, I want a quote for ${title}. Please share required documents, total premium, and payment steps.`
  );

  const insuranceItem = {
    id: title,
    type: "insurance" as const,
    name: title,
    price: estimatedPrice,
    image: "/SPIROSPARE_LOGO.png",
    sku: audience
  };

  return (
    <article className="panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00BFFF]">{audience}</p>
      <h2 className="mt-2 text-xl font-bold tracking-tight text-white">{title}</h2>

      <div className="mt-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">Covered</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-300">
          {covered.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-gray-500">Not Covered</h3>
        <ul className="mt-2 space-y-1 text-sm text-gray-300">
          {excluded.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-5 rounded-xl border border-[#EAB308]/35 bg-[#EAB308]/10 px-3 py-2 text-sm font-semibold text-[#8A6200]">
        Estimated plan starts from KES {estimatedPrice.toLocaleString("en-KE")}
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link
          href={`/contact?topic=insurance&plan=${encodedPlan}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#00BFFF]/40 bg-white px-3 py-2 text-sm font-semibold text-[#0086B5] transition-all duration-300 ease-out hover:border-[#00BFFF]/65"
        >
          <FileText className="h-4 w-4" /> Get Quote
        </Link>

        <button
          type="button"
          onClick={() => addToCart(insuranceItem)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00BFFF] px-3 py-2 text-sm font-semibold text-white transition-all duration-300 ease-out hover:brightness-110"
        >
          <ShoppingCart className="h-4 w-4" /> Cart
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(insuranceItem)}
          className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 ease-out ${
            isWishlisted
              ? "border-[#00BFFF]/60 bg-[#00BFFF]/15 text-[#0086B5]"
              : "border-white/20 bg-white/5 text-slate-700 hover:border-[#00BFFF]/50"
          }`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} /> Wishlist
        </button>

        <a
          href={`https://wa.me/254733959383?text=${whatsappMessage}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/45 bg-[#25D366]/10 px-3 py-2 text-sm font-semibold text-[#1f7a3c] transition-all duration-300 ease-out hover:border-[#25D366]/70"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
      </div>
    </article>
  );
}

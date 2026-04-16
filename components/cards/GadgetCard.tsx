"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Gadget, formatKES } from "@/lib/data";
import { useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type GadgetCardProps = {
  gadget: Gadget;
  compact?: boolean;
};

export default function GadgetCard({ gadget, compact = false }: GadgetCardProps) {
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const isWishlisted = useShopStore((state) => state.isWishlisted(gadget.id, "gadget"));
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const discountedPrice = applyStockPointDiscount(gadget.price);

  return (
    <article className="panel group flex h-full flex-col overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50 hover:shadow-[inset_0_0_26px_rgba(0, 191, 255,0.1)]">
      <Link href={`/gadgets/${gadget.id}`} className={`relative block overflow-hidden bg-[#1A1A1A] ${compact ? "aspect-square" : "aspect-[4/3]"}`}>
        <Image
          src={gadget.images[0]}
          alt={`Spiro add-ons and gadgets ${gadget.name} for delivery riders in Nairobi`}
          fill
          sizes={compact ? "(max-width: 768px) 45vw, 12vw" : "(max-width: 768px) 100vw, 30vw"}
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
      </Link>
      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-4"}`}>
        <h3 className={`${compact ? "text-sm" : "text-lg"} font-bold tracking-tight text-white`} style={{ fontFamily: "var(--font-heading)" }}>
          {gadget.name}
        </h3>
        {!compact ? <p className="min-h-[20px] text-sm text-gray-400">{gadget.category}</p> : null}
        <div>
          <p className={`${compact ? "text-sm" : "text-lg"} font-bold text-white`}>
            {formatKES(isStockPointAuthenticated ? discountedPrice : gadget.price)}
          </p>
          {isStockPointAuthenticated ? (
            <p className="text-xs text-gray-500 line-through">{formatKES(gadget.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
          ) : null}
        </div>
        <div className={`mt-auto grid gap-2 ${compact ? "grid-cols-[minmax(0,1fr)_36px_36px]" : "grid-cols-[minmax(0,1fr)_44px_44px]"}`}>
          <Link
            href={`/gadgets/${gadget.id}`}
            className={`inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${compact ? "min-h-[36px] px-2 text-xs font-semibold" : "min-h-[44px] px-3 text-sm font-bold"}`}
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={() =>
              addToCart({
                id: gadget.id,
                type: "gadget",
                name: gadget.name,
                price: gadget.price,
                image: gadget.images[0]
              })
            }
            className={`inline-flex items-center justify-center rounded-xl bg-[#00BFFF] text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.35)] ${compact ? "min-h-[36px]" : "min-h-[44px] text-sm font-bold"}`}
            aria-label={`Add ${gadget.name} to cart`}
          >
            <ShoppingCart className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
          <button
            type="button"
            onClick={() =>
              toggleWishlist({
                id: gadget.id,
                type: "gadget",
                name: gadget.name,
                price: gadget.price,
                image: gadget.images[0]
              })
            }
            className={`inline-flex items-center justify-center rounded-xl border transition-all duration-300 ease-out ${compact ? "min-h-[36px] px-2" : "min-h-[44px] px-3 text-sm"} ${
              isWishlisted
                ? "border-[#00BFFF]/60 bg-[#00BFFF]/15 text-[#00BFFF]"
                : "border-slate-300 bg-white text-slate-700 hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
            }`}
            aria-label={`Add ${gadget.name} to wishlist`}
          >
            <Heart className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${isWishlisted ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </article>
  );
}

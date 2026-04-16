"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Bike, formatKES } from "@/lib/data";
import { useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type BikeCardProps = {
  bike: Bike;
  featured?: boolean;
  href?: string;
  compact?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  selectorOnly?: boolean;
};

export default function BikeCard({
  bike,
  featured = false,
  href,
  compact = false,
  showDescription = true,
  showPrice = true,
  selectorOnly = false
}: BikeCardProps) {
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const isWishlisted = useShopStore((state) => state.isWishlisted(bike.id, "bike"));
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const discountedPrice = applyStockPointDiscount(bike.price);

  return (
    <article
      className={`panel group flex h-full flex-col overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50 hover:shadow-[inset_0_0_26px_rgba(0, 191, 255,0.1)] ${
        featured ? "md:col-span-2" : ""
      }`}
      aria-label={`Spiro ${bike.name} electric bike card`}
    >
      <Link href={href ?? `/bikes/${bike.id}`} className={`relative block overflow-hidden bg-[#1A1A1A] ${compact ? "aspect-square" : "aspect-[4/3]"}`}>
        <Image
          src={bike.images[0]}
          alt={`Spiro ${bike.name} battery swapping point in Nairobi for delivery riders`}
          fill
          sizes={compact ? "(max-width: 768px) 45vw, 12vw" : featured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 24vw"}
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        {featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-green/20 px-3 py-1 text-xs font-bold text-green">
            Featured
          </span>
        ) : null}
      </Link>

      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-4"}`}>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">SKU: {bike.SKU}</p>
        <h3 className={`${compact ? "text-sm" : "text-lg"} font-bold tracking-tight text-white`} style={{ fontFamily: "var(--font-heading)" }}>
          {bike.name}
        </h3>
        {showDescription && !compact ? <p className="min-h-[44px] text-sm text-gray-400">{bike.short_description}</p> : null}
        {showPrice ? (
          <div>
            <p className={`${compact ? "text-sm" : "text-lg"} font-bold text-white`}>
              {formatKES(isStockPointAuthenticated ? discountedPrice : bike.price)}
            </p>
            {isStockPointAuthenticated ? (
              <p className="text-xs text-gray-500 line-through">{formatKES(bike.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}
          </div>
        ) : null}
        <div className={`mt-auto grid gap-2 ${selectorOnly ? "grid-cols-1" : compact ? "grid-cols-[minmax(0,1fr)_36px_36px]" : "grid-cols-[minmax(0,1fr)_44px_44px]"}`}>
          <Link
            href={href ?? `/bikes/${bike.id}`}
            className={`inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${compact ? "min-h-[36px] px-2 text-xs font-semibold" : "min-h-[44px] px-3 text-sm font-bold"}`}
          >
            {href ? "View Spares" : "View Details"}
          </Link>
          {!selectorOnly ? (
            <button
              type="button"
              onClick={() =>
                addToCart({ id: bike.id, type: "bike", name: bike.name, price: bike.price, image: bike.images[0], sku: bike.SKU })
              }
              className={`inline-flex items-center justify-center rounded-xl bg-[#00BFFF] text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.35)] ${compact ? "min-h-[36px]" : "min-h-[44px] text-sm font-bold"}`}
              aria-label={`Add ${bike.name} to cart`}
            >
              <ShoppingCart className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            </button>
          ) : null}
          {!selectorOnly ? (
            <button
              type="button"
              onClick={() =>
                toggleWishlist({ id: bike.id, type: "bike", name: bike.name, price: bike.price, image: bike.images[0], sku: bike.SKU })
              }
              className={`inline-flex items-center justify-center rounded-xl border transition-all duration-300 ease-out ${compact ? "min-h-[36px] px-2" : "min-h-[44px] px-3 text-sm"} ${
                isWishlisted
                  ? "border-[#00BFFF]/60 bg-[#00BFFF]/15 text-[#00BFFF]"
                  : "border-slate-300 bg-white text-slate-700 hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              }`}
              aria-label={`Add ${bike.name} to wishlist`}
            >
              <Heart className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

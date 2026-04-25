"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, MouseEvent, useState } from "react";
import { AlertTriangle, Heart } from "lucide-react";
import { Bike, formatKES } from "@/lib/data";
import RestockRequestButton from "@/components/stock/RestockRequestButton";
import { useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";
import AddToCartButton from "@/components/AddToCartButton";

type BikeCardProps = {
  bike: Bike;
  featured?: boolean;
  href?: string;
  compact?: boolean;
  showDescription?: boolean;
  showPrice?: boolean;
  selectorOnly?: boolean;
  titleOverride?: string;
};

export default function BikeCard({
  bike,
  featured = false,
  href,
  compact = false,
  showDescription = true,
  showPrice = true,
  selectorOnly = false,
  titleOverride
}: BikeCardProps) {
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const isWishlisted = useShopStore((state) => state.isWishlisted(bike.id, "bike"));
  const isInCart = useShopStore((state) => state.cart.some((item) => item.id === bike.id && item.type === "bike"));
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const discountedPrice = applyStockPointDiscount(bike.price);
  const detailHref = href ?? `/bikes/${bike.id}`;
  const displayName = titleOverride ?? bike.name;
  const [quantity, setQuantity] = useState(1);
  const cartItem = useShopStore((state) => state.cart.find((item) => item.id === bike.id && item.type === "bike"));
  const effectiveQuantity = cartItem?.quantity ?? quantity;
  const isInStock = bike.stock > 0;

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, label")) {
      return;
    }

    router.push(detailHref);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("button, a, input, select, textarea, label")) {
      return;
    }

    event.preventDefault();
    router.push(detailHref);
  };

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      className={`panel group flex h-full flex-col overflow-hidden transition-all duration-300 ease-out hover:border-[#00BFFF]/50 hover:shadow-[inset_0_0_26px_rgba(0, 191, 255,0.1)] ${
        featured ? "md:col-span-2" : ""
      }`}
      aria-label={`Spiro ${displayName} electric bike card`}
    >
      <div className={`relative block overflow-hidden bg-[#1A1A1A] ${compact ? "aspect-square" : "aspect-[4/3]"}`}>
        <Image
          src={bike.images[0]}
          alt={`Spiro ${displayName} battery swapping point in Nairobi for delivery riders`}
          fill
          sizes={compact ? "(max-width: 768px) 45vw, 12vw" : featured ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 24vw"}
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        {featured ? (
          <span className="absolute left-4 top-4 rounded-full bg-green/20 px-3 py-1 text-xs font-bold text-green">
            Featured
          </span>
        ) : null}
        {!isInStock ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            <AlertTriangle className="h-3 w-3" />
            Out of stock
          </span>
        ) : null}
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-4"}`}>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500">SKU: {bike.SKU}</p>
        <h3 className={`${compact ? "text-sm" : "text-lg"} font-bold tracking-tight text-white`} style={{ fontFamily: "var(--font-heading)" }}>
          {displayName}
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
        <div className="mt-auto space-y-2 pt-3">
          <div className={`grid gap-2 ${selectorOnly ? "grid-cols-1" : compact ? "grid-cols-[1fr_36px]" : "grid-cols-[1fr_44px]"}`}>
            {selectorOnly ? (
              // Model selector - show View Spares button
              <Link
                href={detailHref}
                className={`inline-flex items-center justify-center rounded-xl bg-[#00BFFF] text-white transition-all duration-300 ease-out hover:brightness-110 ${compact ? "min-h-[36px] px-2 text-xs font-semibold" : "min-h-[44px] px-3 text-sm font-bold"}`}
              >
                View Spares
              </Link>
            ) : isInStock ? (
              <AddToCartButton
                item={{ id: bike.id, type: "bike", name: bike.name, price: bike.price, image: bike.images[0], sku: bike.SKU }}
                compact={compact}
              />
            ) : (
              <RestockRequestButton
                productId={bike.id}
                productName={bike.name}
                productType="bike"
                sku={bike.SKU}
                compact={compact}
              />
            )}
            {!selectorOnly && (
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
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

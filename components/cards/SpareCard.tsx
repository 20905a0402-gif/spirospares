"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyboardEvent, MouseEvent, useState } from "react";
import { AlertTriangle, Heart } from "lucide-react";
import { SparePart, formatKES } from "@/lib/data";
import { useShopStore } from "@/lib/store";
import RestockRequestButton from "@/components/stock/RestockRequestButton";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";
import AddToCartButton from "@/components/AddToCartButton";

type SpareCardProps = {
  part: SparePart;
  compact?: boolean;
};

export default function SpareCard({ part, compact = false }: SpareCardProps) {
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const toggleWishlist = useShopStore((state) => state.toggleWishlist);
  const isWishlisted = useShopStore((state) => state.isWishlisted(part.id, "spare"));
  const isInCart = useShopStore((state) => state.cart.some((item) => item.id === part.id && item.type === "spare"));
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const discountedPrice = applyStockPointDiscount(part.price);
  const detailHref = `/spares/${part.id}`;
  const [quantity, setQuantity] = useState(1);
  const cartItem = useShopStore((state) => state.cart.find((item) => item.id === part.id && item.type === "spare"));
  const effectiveQuantity = cartItem?.quantity ?? quantity;

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
      className="panel group flex h-full cursor-pointer flex-col overflow-hidden transition-all duration-300 ease-out hover:border-[#00BFFF]/50 hover:shadow-[inset_0_0_26px_rgba(0, 191, 255,0.1)]"
    >
      <div className={`relative block overflow-hidden bg-[#1A1A1A] ${compact ? "aspect-square" : "aspect-[4/3]"}`}>
        <Image
          src={part.image}
          alt={`Spiro EV spare part ${part.name} in Nairobi with battery swapping network compatibility`}
          fill
          sizes={compact ? "(max-width: 768px) 45vw, 12vw" : "(max-width: 768px) 100vw, 30vw"}
          className="object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        {part.stock <= 0 ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
            <AlertTriangle className="h-3 w-3" />
            Out of stock
          </span>
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-4"}`}>
        <h3 className={`${compact ? "text-sm" : "text-lg"} font-bold tracking-tight text-white`} style={{ fontFamily: "var(--font-heading)" }}>
          {part.name}
        </h3>
        <p className="text-[10px] uppercase tracking-[0.16em] text-gray-500">SKU: {part.part_code}</p>
        {!compact ? <p className="text-sm text-gray-400">{part.category}</p> : null}
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className={`${compact ? "text-sm" : "text-lg"} font-bold text-white`}>
              {formatKES(isStockPointAuthenticated ? discountedPrice : part.price)}
            </p>
            {isStockPointAuthenticated ? (
              <p className="text-xs text-gray-500 line-through">{formatKES(part.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}
          </div>
          {!compact ? (
            part.stock > 0 ? (
              <span className="rounded-full bg-green/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-green">
                In Stock
              </span>
            ) : (
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
                Restock request available
              </span>
            )
          ) : null}
        </div>
        <div className="mt-auto space-y-2">
          <div className={`grid gap-2 ${compact ? "grid-cols-[1fr_36px]" : "grid-cols-[1fr_44px]"}`}>
            {part.stock > 0 ? (
              <AddToCartButton
                item={{ id: part.id, type: "spare", name: part.name, price: part.price, image: part.image, sku: part.part_code }}
                compact={compact}
              />
            ) : (
              <RestockRequestButton
                productId={part.id}
                productName={part.name}
                productType="spare"
                sku={part.part_code}
                compact={compact}
              />
            )}
            <button
              type="button"
              onClick={() =>
                toggleWishlist({
                  id: part.id,
                  type: "spare",
                  name: part.name,
                  price: part.price,
                  image: part.image,
                  sku: part.part_code
                })
              }
              className={`inline-flex items-center justify-center rounded-xl border transition-all duration-300 ease-out ${compact ? "min-h-[36px] px-2" : "min-h-[44px] px-3 text-sm"} ${
                isWishlisted
                  ? "border-[#00BFFF]/60 bg-[#00BFFF]/15 text-[#00BFFF]"
                  : "border-slate-300 bg-white text-slate-700 hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              }`}
              aria-label={`Add ${part.name} to wishlist`}
            >
              <Heart className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"} ${isWishlisted ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

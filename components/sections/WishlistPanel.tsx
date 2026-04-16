"use client";

import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { formatKES } from "@/lib/data";
import { useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

export default function WishlistPanel() {
  const wishlist = useShopStore((state) => state.wishlist);
  const addToCart = useShopStore((state) => state.addToCart);
  const removeFromWishlist = useShopStore((state) => state.removeFromWishlist);
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);

  if (wishlist.length === 0) {
    return <div className="panel p-8 text-center text-gray-400">Your wishlist is currently empty.</div>;
  }

  return (
    <div className="wishlist-grid">
      {wishlist.map((item) => (
        <article key={`${item.type}-${item.id}`} className="panel p-4">
          <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-[#1A1A1A]">
            <Image src={item.image} alt={`${item.name} wishlist item`} fill sizes="300px" className="object-cover" />
          </div>

          <h2 className="text-lg font-semibold text-white">{item.name}</h2>
          <p className="text-sm text-gray-500">{item.sku ?? item.type.toUpperCase()}</p>
          <p className="mt-1 text-xl font-bold text-white">
            {formatKES(
              isStockPointAuthenticated
                ? applyStockPointDiscount(item.basePrice ?? item.price)
                : item.basePrice ?? item.price
            )}
          </p>
          {isStockPointAuthenticated ? (
            <p className="text-xs text-gray-500 line-through">
              {formatKES(item.basePrice ?? item.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)
            </p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => addToCart(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00BFFF] px-3 py-2 text-sm font-bold text-white"
            >
              <ShoppingCart className="h-4 w-4" /> Add to Cart
            </button>
            <button
              type="button"
              onClick={() => removeFromWishlist(item.id, item.type)}
              className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white"
            >
              <Heart className="h-4 w-4 fill-current" />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}


"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatKES } from "@/lib/data";
import { useShopStore } from "@/lib/store";
import { STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

export default function CartPanel() {
  const cart = useShopStore((state) => state.cart);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const updateCartQuantity = useShopStore((state) => state.updateCartQuantity);
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);

  const total = cart.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);
  const baseTotal = cart.reduce((accumulator, item) => accumulator + (item.basePrice ?? item.price) * item.quantity, 0);

  if (cart.length === 0) {
    return <div className="panel p-8 text-center text-gray-400">Your cart is currently empty.</div>;
  }

  return (
    <div className="grid gap-4">
      {cart.map((item) => (
        <article key={`${item.type}-${item.id}`} className="panel flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-[#1A1A1A]">
            <Image src={item.image} alt={`${item.name} cart item`} fill sizes="96px" className="object-cover" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">{item.name}</h2>
            <p className="text-sm text-gray-500">{item.sku ?? item.type.toUpperCase()}</p>
            <p className="mt-1 font-bold text-white">{formatKES(item.price)}</p>
            {isStockPointAuthenticated ? (
              <p className="text-xs text-gray-500 line-through">{formatKES(item.basePrice ?? item.price)}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateCartQuantity(item.id, item.type, item.quantity - 1)}
              className="rounded-lg border border-white/15 bg-white/5 p-2 text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
            <button
              type="button"
              onClick={() => updateCartQuantity(item.id, item.type, item.quantity + 1)}
              className="rounded-lg border border-white/15 bg-white/5 p-2 text-white"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeFromCart(item.id, item.type)}
            className="inline-flex items-center gap-1 rounded-lg border border-red/40 bg-red/10 px-3 py-2 text-sm font-semibold text-red"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </button>
        </article>
      ))}

      <div className="panel p-5 text-right">
        <p className="text-sm text-gray-500">Estimated Total</p>
        <p className="text-3xl font-bold text-white">{formatKES(total)}</p>
        {isStockPointAuthenticated ? (
          <p className="mt-1 text-xs text-gray-500">Base {formatKES(baseTotal)} with Stock Point discount (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
        ) : null}
        <Link
          href={`/checkout?type=spare&id=cart-order&name=${encodeURIComponent("Cart Order")}&price=${total}`}
          className="mt-4 inline-flex rounded-xl bg-[#00BFFF] px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}


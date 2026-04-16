"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatKES } from "@/lib/data";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";
import { useShopStore } from "@/lib/store";

type ProductType = "bike" | "spare" | "gadget" | "insurance";

export default function CheckoutPanel() {
  const params = useSearchParams();
  const router = useRouter();
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const [booked, setBooked] = useState(false);
  const [expressDelivery, setExpressDelivery] = useState(false);

  const EXPRESS_DELIVERY_FEE = 500;

  const product = useMemo(() => {
    const type = (params.get("type") ?? "spare") as ProductType;
    const id = params.get("id") ?? "";
    const name = params.get("name") ?? "Selected Product";
    const price = Number(params.get("price") ?? "0");

    return { type, id, name, price };
  }, [params]);

  const baseSubtotal = product.price || 0;
  const subtotal =
    isStockPointAuthenticated && product.id !== "cart-order"
      ? applyStockPointDiscount(baseSubtotal)
      : baseSubtotal;
  const deliveryFee = expressDelivery ? EXPRESS_DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="mx-auto max-w-3xl">
      {!booked ? (
        <article className="panel p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white">Order Summary</h1>
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">{product.type}</p>
            <p className="mt-2 text-xl font-semibold text-white">{product.name}</p>
            <p className="mt-2 text-2xl font-bold text-white">{formatKES(subtotal)}</p>
            {isStockPointAuthenticated && product.id !== "cart-order" ? (
              <p className="text-xs text-gray-500 line-through">{formatKES(baseSubtotal)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">Express delivery</p>
                <p className="text-xs text-gray-500">Priority dispatch within the shortest available window.</p>
              </div>
              <input
                type="checkbox"
                checked={expressDelivery}
                onChange={(event) => setExpressDelivery(event.target.checked)}
                className="h-4 w-4 accent-[#00BFFF]"
              />
            </label>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="font-semibold text-white">{formatKES(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-gray-500">
                <span>Express surcharge</span>
                <span className="font-semibold text-white">{formatKES(deliveryFee)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between border-t border-white/10 pt-2 text-base font-bold text-white">
                <span>Total</span>
                <span>{formatKES(total)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setBooked(true)}
              className="rounded-xl bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
            >
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
            >
              Back to Previous Screen
            </button>
          </div>
        </article>
      ) : (
        <article className="panel p-8 text-center">
          <p className="text-5xl">\u2705</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">Successfully Booked</h2>
          <p className="mt-2 text-gray-400">
            Your request for {product.name} has been booked successfully.
            {expressDelivery ? " Express delivery has been added to your order." : ""} Our team will contact you shortly.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
            >
              Back to Home
            </Link>
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
            >
              Back to Previous Screen
            </button>
          </div>
        </article>
      )}
    </div>
  );
}


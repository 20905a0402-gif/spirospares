"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Gadget, formatKES } from "@/lib/data";
import { ProductActionItem, useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type GadgetProductDetailProps = {
  gadget: Gadget;
};

export default function GadgetProductDetail({ gadget }: GadgetProductDetailProps) {
  const [activeImage, setActiveImage] = useState(gadget.images[0]);
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);

  const item: ProductActionItem = useMemo(
    () => ({
      id: gadget.id,
      type: "gadget",
      name: gadget.name,
      price: gadget.price,
      image: gadget.images[0]
    }),
    [gadget]
  );

  const handleBuyNow = () => {
    addToCart(item);
    router.push(`/checkout?type=gadget&id=${gadget.id}&name=${encodeURIComponent(gadget.name)}&price=${gadget.price}`);
  };

  const thumbnails = [gadget.images[0], gadget.images[0], gadget.images[0]];
  const discountedPrice = applyStockPointDiscount(gadget.price);
  const mrp = Math.round(gadget.price * 1.16);

  return (
    <section className="container-shell py-10 pb-28 md:pb-10">
      <div className="grid gap-6 lg:grid-cols-[100px_minmax(0,620px)_1fr]">
        <aside className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
          {thumbnails.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                activeImage === image ? "border-[#00BFFF]" : "border-white/15"
              }`}
            >
              <Image src={image} alt={`Thumbnail ${index + 1} for ${gadget.name}`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </aside>

        <div className="panel order-1 overflow-hidden lg:order-2 lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-square bg-[#1A1A1A]">
            <Image
              src={activeImage}
              alt={`Main product image for ${gadget.name}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>

        <article className="order-3 space-y-6">
          <div className="panel p-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">{gadget.name}</h1>
            <div className="mt-3 flex items-center gap-1 text-[#00BFFF]">
              {Array.from({ length: 4 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <Star className="h-4 w-4 text-gray-600" />
              <span className="ml-2 text-sm text-gray-400">4.8 rider rating</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-white">{formatKES(isStockPointAuthenticated ? discountedPrice : gadget.price)}</p>
              <p className="text-lg text-gray-500 line-through">{formatKES(mrp)}</p>
              <p className="text-sm font-semibold text-green">Save 16%</p>
            </div>
            {isStockPointAuthenticated ? (
              <p className="mt-1 text-xs text-gray-500">Stock Point price applied: {formatKES(gadget.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}

            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              {gadget.features.map((feature) => (
                <li key={feature} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-2 text-sm text-gray-300 md:grid-cols-2">
              <p>Category: {gadget.category}</p>
              <p>Compatibility: {gadget.compatibility}</p>
            </div>

            <div className="mt-6 hidden grid-cols-2 gap-3 md:grid">
              <button
                type="button"
                onClick={() => addToCart(item)}
                className="rounded-xl border border-white/15 bg-[#121212] px-6 py-4 text-sm font-extrabold tracking-wide text-white transition hover:border-[#00BFFF]/60"
              >
                ADD TO CART
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="rounded-xl bg-[#00BFFF] px-6 py-4 text-sm font-extrabold tracking-wide text-white transition hover:shadow-[0_0_16px_rgba(0, 191, 255,0.45)]"
              >
                BUY NOW
              </button>
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-bold text-white">Technical Details</h2>
            <p className="mt-2 text-gray-300">{gadget.technical_details}</p>
          </div>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-white/10 bg-[#090909]/95 p-3 backdrop-blur md:hidden">
        <button
          type="button"
          onClick={() => addToCart(item)}
          className="rounded-lg border border-white/15 bg-[#121212] px-4 py-3 text-xs font-extrabold tracking-wide text-white"
        >
          ADD TO CART
        </button>
        <button
          type="button"
          onClick={handleBuyNow}
          className="rounded-lg bg-[#00BFFF] px-4 py-3 text-xs font-extrabold tracking-wide text-white"
        >
          BUY NOW
        </button>
      </div>
    </section>
  );
}


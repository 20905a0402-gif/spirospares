"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import TextWithEVHighlight from "@/components/TextWithEVHighlight";
import { SparePart, formatKES } from "@/lib/data";
import { ProductActionItem, useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type SpareProductDetailProps = {
  part: SparePart;
};

export default function SpareProductDetail({ part }: SpareProductDetailProps) {
  const [activeImage, setActiveImage] = useState(part.image);
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);

  const handleBuyNow = () => {
    addToCart(item);
    router.push(`/checkout?type=spare&id=${part.id}&name=${encodeURIComponent(part.name)}&price=${part.price}`);
  };

  const item: ProductActionItem = useMemo(
    () => ({
      id: part.id,
      type: "spare",
      name: part.name,
      price: part.price,
      image: part.image,
      sku: part.part_code
    }),
    [part]
  );

  const thumbnails = [part.image, part.image, part.image];
  const discountedPrice = applyStockPointDiscount(part.price);
  const mrp = Math.round(part.price * 1.18);

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
              <Image src={image} alt={`Thumbnail ${index + 1} for ${part.name} EV spare`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </aside>

        <div className="panel order-1 overflow-hidden lg:order-2 lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-square bg-[#1A1A1A]">
            <Image src={activeImage} alt={`Main product image for ${part.name} EV spare`} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>

        <article className="order-3 space-y-6">
          <div className="panel p-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              <TextWithEVHighlight text={`${part.name} EV Spare`} />
            </h1>
            <div className="mt-3 flex items-center gap-1 text-[#00BFFF]">
              {Array.from({ length: 4 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <Star className="h-4 w-4 text-gray-600" />
              <span className="ml-2 text-sm text-gray-400">4.7 fitment rating</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-white">{formatKES(isStockPointAuthenticated ? discountedPrice : part.price)}</p>
              <p className="text-lg text-gray-500 line-through">{formatKES(mrp)}</p>
              <p className="text-sm font-semibold text-green">Save 18%</p>
            </div>
            {isStockPointAuthenticated ? (
              <p className="mt-1 text-xs text-gray-500">Stock Point price applied: {formatKES(part.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}

            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">OEM-compatible quality checks on every dispatch batch.</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Priority fulfillment for high-demand fleet maintenance.</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Technical support for installation and replacement cycle guidance.</li>
            </ul>

            <div className="mt-6 grid gap-2 text-sm text-gray-300 md:grid-cols-2">
              <p>SKU: {part.part_code}</p>
              <p>Category: {part.category}</p>
              <p>Material: {part.material}</p>
              <p>Quality: {part.quality}</p>
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
            <h2 className="text-xl font-bold text-white">Function and Replacement Cycle</h2>
            <p className="mt-2 text-gray-300">{part.function}</p>
            <p className="mt-3 text-gray-400">{part.replacement_cycle}</p>
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


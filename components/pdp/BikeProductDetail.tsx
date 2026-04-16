"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import TextWithEVHighlight from "@/components/TextWithEVHighlight";
import { Bike, Gadget, SparePart, formatKES } from "@/lib/data";
import { ProductActionItem, useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type BikeProductDetailProps = {
  bike: Bike;
  compatibleSpares: SparePart[];
  relatedGadgets: Gadget[];
};

export default function BikeProductDetail({ bike, compatibleSpares, relatedGadgets }: BikeProductDetailProps) {
  const [activeImage, setActiveImage] = useState(bike.images[0]);
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);

  const handleBuyNow = () => {
    addToCart(item);
    router.push(`/checkout?type=bike&id=${bike.id}&name=${encodeURIComponent(bike.name)}&price=${bike.price}`);
  };

  const item: ProductActionItem = useMemo(
    () => ({
      id: bike.id,
      type: "bike",
      name: bike.name,
      price: bike.price,
      image: bike.images[0],
      sku: bike.SKU
    }),
    [bike]
  );

  const mrp = Math.round(bike.price * 1.14);
  const discountedPrice = applyStockPointDiscount(bike.price);

  return (
    <section className="container-shell py-10 pb-28 md:pb-10">
      <div className="grid gap-6 lg:grid-cols-[100px_minmax(0,620px)_1fr]">
        <aside className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible">
          {bike.images.map((image) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition ${
                activeImage === image ? "border-[#00BFFF]" : "border-white/15"
              }`}
            >
              <Image src={image} alt={`Thumbnail for ${bike.name} EV bike`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </aside>

        <div className="panel order-1 overflow-hidden lg:order-2 lg:sticky lg:top-24 lg:h-fit">
          <div className="relative aspect-square bg-[#1A1A1A]">
            <Image src={activeImage} alt={`Main view of ${bike.name} EV bike`} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
          </div>
        </div>

        <article className="order-3 space-y-6">
          <div className="panel p-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              <TextWithEVHighlight text={`${bike.name} EV Performance Bike`} />
            </h1>
            <div className="mt-3 flex items-center gap-1 text-[#00BFFF]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
              <span className="ml-2 text-sm text-gray-400">4.9 rider rating</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-white">{formatKES(isStockPointAuthenticated ? discountedPrice : bike.price)}</p>
              <p className="text-lg text-gray-500 line-through">{formatKES(mrp)}</p>
              <p className="text-sm font-semibold text-green">Save 14%</p>
            </div>
            {isStockPointAuthenticated ? (
              <p className="mt-1 text-xs text-gray-500">Stock Point price applied: {formatKES(bike.price)} (-{Math.round(STOCK_POINT_DISCOUNT_RATE * 100)}%)</p>
            ) : null}

            <ul className="mt-6 space-y-2 text-sm text-gray-300">
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Free setup support for Nairobi fleet onboarding.</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Fast dispatch in major counties with verified logistics partners.</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Manufacturer-backed fitment and battery swapping network compatibility.</li>
            </ul>

            <div className="mt-6 grid gap-2 text-sm text-gray-300 md:grid-cols-2">
              <p>Motor: {bike.motor}</p>
              <p>Range: {bike.range}</p>
              <p>Speed: {bike.speed}</p>
              <p>Battery: {bike.battery}</p>
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
            <h2 className="text-xl font-bold text-white">Compatible Spares</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {compatibleSpares.slice(0, 6).map((part) => (
                <Link key={part.id} href={`/spares/${part.id}`} className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#00BFFF]/50">
                  <p className="font-semibold text-white">{part.name}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{part.part_code}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-bold text-white">Recommended Accessories</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedGadgets.map((gadget) => (
                <Link key={gadget.id} href={`/gadgets/${gadget.id}`} className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:border-[#00BFFF]/50">
                  <p className="font-semibold text-white">{gadget.name}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{gadget.category}</p>
                </Link>
              ))}
            </div>
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


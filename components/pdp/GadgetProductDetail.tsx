"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertTriangle, Star } from "lucide-react";
import RestockRequestButton from "@/components/stock/RestockRequestButton";
import ProductImageMagnifier from "@/components/pdp/ProductImageMagnifier";
import QuantitySelector from "@/components/QuantitySelector";
import { Gadget, formatKES } from "@/lib/data";
import { ProductActionItem, useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type GadgetProductDetailProps = {
  gadget: Gadget;
};

export default function GadgetProductDetail({ gadget }: GadgetProductDetailProps) {
  const [activeImage, setActiveImage] = useState(gadget.images[0]);
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const isInCart = useShopStore((state) => state.cart.some((item) => item.id === gadget.id && item.type === "gadget"));
  const cartItem = useShopStore((state) => state.cart.find((item) => item.id === gadget.id && item.type === "gadget"));
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const isInStock = (gadget.stock ?? 1) > 0;

  // Sync local quantity with cart quantity if in cart
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

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
    if (!isInStock) {
      return;
    }

    const qtyToAdd = quantity === 0 ? 1 : quantity;
    addToCart(item, qtyToAdd);
    router.push(`/checkout?type=gadget&id=${gadget.id}&name=${encodeURIComponent(gadget.name)}&price=${gadget.price * qtyToAdd}&quantity=${qtyToAdd}`);
  };

  const handlePrimaryAction = () => {
    if (isInCart) {
      router.push("/cart");
      return;
    }

    const qtyToAdd = quantity === 0 ? 1 : quantity;
    setQuantity(qtyToAdd);
    addToCart(item, qtyToAdd);
  };

  const thumbnails = [gadget.images[0], gadget.images[0], gadget.images[0]];
  const discountedPrice = applyStockPointDiscount(gadget.price);
  const mrp = Math.round(gadget.price * 1.16);

  return (
    <section className="container-shell py-10 pb-28 md:pb-10">
      <div className="grid gap-6 lg:grid-cols-[100px_minmax(0,620px)_1fr]">
        <aside className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:h-fit lg:flex-col lg:overflow-visible">
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

        <div className="panel order-1 overflow-visible lg:order-2 lg:sticky lg:top-24 lg:h-fit">
          <ProductImageMagnifier
            src={activeImage}
            alt={`Main product image for ${gadget.name}`}
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="overflow-hidden rounded-2xl"
          />
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

            {/* Specifications in icon cards */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Category</p>
                  <p className="text-xs font-semibold text-white truncate">{gadget.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Compatibility</p>
                  <p className="text-xs font-semibold text-white truncate">{gadget.compatibility}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Stock</p>
                  <p className="text-xs font-semibold text-white truncate">{gadget.stock ?? "In Stock"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Features</p>
                  <p className="text-xs font-semibold text-white truncate">{gadget.features.length} key features</p>
                </div>
              </div>
            </div>

            {/* Color Selector */}
            <div className="mt-6">
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                Select Colour
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="relative h-10 w-10 rounded-full border-2 border-[#00BFFF] bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg transition hover:scale-110"
                  aria-label="Select Yellow"
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="h-5 w-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-gray-700 to-gray-900 shadow-lg transition hover:scale-110 hover:border-[#00BFFF]/50"
                  aria-label="Select Black"
                />
                <button
                  type="button"
                  className="h-10 w-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-red-500 to-red-700 shadow-lg transition hover:scale-110 hover:border-[#00BFFF]/50"
                  aria-label="Select Red"
                />
                <button
                  type="button"
                  className="h-10 w-10 rounded-full border-2 border-white/20 bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg transition hover:scale-110 hover:border-[#00BFFF]/50"
                  aria-label="Select Blue"
                />
              </div>
            </div>

            {isInStock ? (
              <div className="mt-6">
                <QuantitySelector
                  value={quantity}
                  onChange={(qty) => {
                    if (qty === undefined) return;
                    setQuantity(qty);
                    if (cartItem) {
                      const { updateCartQuantity } = useShopStore.getState();
                      updateCartQuantity(gadget.id, "gadget", qty);
                    }
                  }}
                  maxQuantity={10}
                />
              </div>
            ) : (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-100/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-amber-300">
                <AlertTriangle className="h-4 w-4" />
                Out of stock
              </div>
            )}

            {isInStock ? (
              <div className="mt-6 hidden grid-cols-2 gap-3 md:grid">
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className={`rounded-xl px-6 py-4 text-sm font-extrabold tracking-wide text-white transition ${
                    isInCart
                      ? "border-2 border-[#00BFFF] bg-transparent text-[#00BFFF] hover:bg-[#00BFFF]/10"
                      : "border border-white/15 bg-[#121212] hover:border-[#00BFFF]/60"
                  }`}
                >
                  {isInCart ? "GO TO CART" : "ADD TO CART"}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="rounded-xl bg-[#00BFFF] px-6 py-4 text-sm font-extrabold tracking-wide text-white transition hover:shadow-[0_0_16px_rgba(0, 191, 255,0.45)]"
                >
                  BUY NOW
                </button>
              </div>
            ) : (
              <div className="mt-6 hidden md:block">
                <RestockRequestButton
                  productId={gadget.id}
                  productName={gadget.name}
                  productType="gadget"
                />
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-bold text-white">Technical Details</h2>
            <p className="mt-2 text-gray-300">{gadget.technical_details}</p>
          </div>
        </article>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#090909]/95 p-3 backdrop-blur md:hidden">
        {isInStock ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handlePrimaryAction}
              className={`rounded-lg px-4 py-3 text-xs font-extrabold tracking-wide text-white ${
                isInCart ? "border-2 border-[#00BFFF] bg-transparent text-[#00BFFF]" : "border border-white/15 bg-[#121212]"
              }`}
            >
              {isInCart ? "GO TO CART" : "ADD TO CART"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="rounded-lg bg-[#00BFFF] px-4 py-3 text-xs font-extrabold tracking-wide text-white"
            >
              BUY NOW
            </button>
          </div>
        ) : (
          <RestockRequestButton
            productId={gadget.id}
            productName={gadget.name}
            productType="gadget"
            compact
          />
        )}
      </div>
    </section>
  );
}


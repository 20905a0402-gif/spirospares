"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertTriangle, Star } from "lucide-react";
import TextWithEVHighlight from "@/components/TextWithEVHighlight";
import RestockRequestButton from "@/components/stock/RestockRequestButton";
import ProductImageMagnifier from "@/components/pdp/ProductImageMagnifier";
import QuantitySelector from "@/components/QuantitySelector";
import { SparePart, formatKES } from "@/lib/data";
import { ProductActionItem, useShopStore } from "@/lib/store";
import { applyStockPointDiscount, STOCK_POINT_DISCOUNT_RATE } from "@/lib/stockPoint";

type SpareProductDetailProps = {
  part: SparePart;
};

export default function SpareProductDetail({ part }: SpareProductDetailProps) {
  const [activeImage, setActiveImage] = useState(part.image);
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const isInCart = useShopStore((state) => state.cart.some((item) => item.id === part.id && item.type === "spare"));
  const cartItem = useShopStore((state) => state.cart.find((item) => item.id === part.id && item.type === "spare"));
  const isStockPointAuthenticated = useShopStore((state) => state.isStockPointAuthenticated);
  const isInStock = part.stock > 0;

  // Sync local quantity with cart quantity if in cart
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const handleBuyNow = () => {
    if (!isInStock) {
      return;
    }

    const qtyToAdd = quantity === 0 ? 1 : quantity;
    addToCart(item, qtyToAdd);
    router.push(`/checkout?type=spare&id=${part.id}&name=${encodeURIComponent(part.name)}&price=${part.price * qtyToAdd}&quantity=${qtyToAdd}`);
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
              <Image src={image} alt={`Thumbnail ${index + 1} for ${part.name} EV spare`} fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </aside>

        <div className="panel order-1 overflow-visible lg:order-2 lg:sticky lg:top-24 lg:h-fit">
          <ProductImageMagnifier
            src={activeImage}
            alt={`Main product image for ${part.name} EV spare`}
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="overflow-hidden rounded-2xl"
          />
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

            {/* Specifications in icon cards */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">SKU</p>
                  <p className="text-xs font-semibold text-white truncate">{part.part_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Category</p>
                  <p className="text-xs font-semibold text-white truncate">{part.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Material</p>
                  <p className="text-xs font-semibold text-white truncate">{part.material}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-3">
                <div className="rounded-lg bg-[#00BFFF]/10 p-2">
                  <svg className="h-4 w-4 text-[#00BFFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">Quality</p>
                  <p className="text-xs font-semibold text-white truncate">{part.quality}</p>
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
                      updateCartQuantity(part.id, "spare", qty);
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
                  productId={part.id}
                  productName={part.name}
                  productType="spare"
                  sku={part.part_code}
                />
              </div>
            )}
          </div>

          <div className="panel p-6">
            <h2 className="text-xl font-bold text-white">Function and Replacement Cycle</h2>
            <p className="mt-2 text-gray-300">{part.function}</p>
            <p className="mt-3 text-gray-400">{part.replacement_cycle}</p>
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
            productId={part.id}
            productName={part.name}
            productType="spare"
            sku={part.part_code}
            compact
          />
        )}
      </div>
    </section>
  );
}


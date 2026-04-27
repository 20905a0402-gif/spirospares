"use client";

import { useState } from "react";
import { Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { useShopStore, ProductActionItem } from "@/lib/store";

type AddToCartButtonProps = {
  item: ProductActionItem;
  compact?: boolean;
};

export default function AddToCartButton({ item, compact = false }: AddToCartButtonProps) {
  const addToCart = useShopStore((state) => state.addToCart);
  const updateCartQuantity = useShopStore((state) => state.updateCartQuantity);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const cartItem = useShopStore((state) => 
    state.cart.find((c) => c.id === item.id && c.type === item.type)
  );
  
  const quantity = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    addToCart(item, 1);
  };

  const handleIncrease = () => {
    updateCartQuantity(item.id, item.type, quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      updateCartQuantity(item.id, item.type, quantity - 1);
    } else {
      removeFromCart(item.id, item.type);
    }
  };

  // Show quantity selector when item is in cart
  if (quantity > 0) {
    return (
      <div 
        className={`flex items-center justify-between gap-0 border-2 border-[#00BFFF] rounded-xl overflow-hidden bg-white ${
          compact ? "h-9" : "h-11"
        }`}
      >
        {/* Decrease/Remove button - shows trash when qty=1, minus when qty>1 */}
        <button
          type="button"
          onClick={handleDecrease}
          className="flex items-center justify-center h-full px-2 text-slate-600 hover:bg-[#00BFFF]/10 transition-colors"
          aria-label={quantity === 1 ? "Remove from cart" : "Decrease quantity"}
        >
          {quantity === 1 ? (
            <Trash2 className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
          ) : (
            <Minus className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
          )}
        </button>
        
        {/* Quantity display */}
        <span className={`flex-1 text-center font-bold text-slate-800 ${compact ? "text-xs" : "text-sm"}`}>
          {quantity}
        </span>
        
        {/* Plus button */}
        <button
          type="button"
          onClick={handleIncrease}
          className="flex items-center justify-center h-full px-2 text-slate-600 hover:bg-[#00BFFF]/10 transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
        </button>
      </div>
    );
  }

  // Show Add to Cart button
  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-1.5 rounded-xl bg-[#00BFFF] text-white transition-all duration-300 ease-out hover:brightness-110 ${
        compact 
          ? "h-9 px-2 text-xs font-semibold" 
          : "h-11 px-3 text-sm font-bold"
      }`}
    >
      <ShoppingCart className={`${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      <span className="whitespace-nowrap">Add to Cart</span>
    </button>
  );
}

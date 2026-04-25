"use client";

import { useState, useRef, useEffect } from "react";
import { ShoppingCart, ChevronDown } from "lucide-react";

type QuantitySelectorProps = {
  value?: number;
  onChange: (value?: number) => void;
  maxQuantity?: number;
  compact?: boolean;
  showAsDropdown?: boolean;
  inCart?: boolean;
  onCartClick?: () => void;
};

export default function QuantitySelector({
  value,
  onChange,
  maxQuantity = 10,
  compact = false,
  showAsDropdown = false,
  inCart = false,
  onCartClick
}: QuantitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate quantities 0-10 (0 shows "Select Quantity" when selected)
  const quantities = Array.from({ length: maxQuantity + 1 }, (_, i) => i);

  const handleSelect = (qty: number) => {
    // If 0 is selected, treat it as undefined (Select Quantity)
    onChange(qty === 0 ? undefined : qty);
    setIsOpen(false);
  };

  // Card version - Cart icon matching wishlist button styles exactly
  if (showAsDropdown) {
    // In cart: active state like wishlisted (cyan border, bg, text)
    if (inCart) {
      return (
        <button
          type="button"
          onClick={onCartClick}
          className={`group relative inline-flex items-center justify-center rounded-full border border-[#00BFFF]/60 bg-[#00BFFF]/15 text-[#00BFFF] transition-all duration-300 ease-out ${
            compact ? "h-9 w-9" : "h-11 w-11"
          }`}
        >
          <ShoppingCart className={compact ? "h-4 w-4" : "h-5 w-5"} />
        </button>
      );
    }

    // Not in cart: default wishlist style (gray border, hover cyan)
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className={`group relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${
          compact ? "h-9 w-9" : "h-11 w-11"
        }`}
      >
        <ShoppingCart className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </button>
    );
  }

  // Product detail version - dropdown matching pickup location style
  const displayValue = value === undefined || value === 0 ? "Select Quantity" : String(value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-700 transition hover:border-[#00BFFF]/70 focus:border-[#00BFFF]/70 focus:outline-none"
      >
        <span className="font-medium">{displayValue}</span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 z-[100] mb-1 overflow-hidden rounded-xl border border-white/15 bg-white shadow-2xl">
          <div className="max-h-48 overflow-y-auto">
            {quantities.map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => handleSelect(qty)}
                className={`w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50 ${
                  (value === qty) || (qty === 0 && (value === undefined || value === 0))
                    ? "bg-[#00BFFF]/10 text-[#00BFFF] font-semibold"
                    : "text-slate-700"
                }`}
              >
                {qty === 0 ? "Select Quantity" : qty}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

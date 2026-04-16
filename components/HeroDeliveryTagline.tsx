"use client";

import { useEffect, useState } from "react";

const deliveryWords = ["Fast", "Direct", "No Hassle"] as const;

export default function HeroDeliveryTagline() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % deliveryWords.length);
    }, 1700);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <span
      aria-live="polite"
      className="relative inline-flex h-[0.95em] min-w-[5.6ch] items-center overflow-hidden align-baseline text-[#EAB308] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
    >
      <span className="pointer-events-none absolute inset-y-0 -left-1 w-1 bg-gradient-to-r from-white/70 to-transparent" />
      <span className="pointer-events-none absolute inset-y-0 -right-1 w-1 bg-gradient-to-l from-white/70 to-transparent" />
      <span className="relative inline-flex h-full items-center overflow-hidden">
        <span key={deliveryWords[activeIndex]} className="delivery-word-enter inline-block">
          {deliveryWords[activeIndex]}
        </span>
      </span>
    </span>
  );
}

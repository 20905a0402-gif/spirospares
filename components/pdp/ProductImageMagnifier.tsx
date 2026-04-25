"use client";

import Image from "next/image";
import { MouseEvent, useState, useRef } from "react";

type ProductImageMagnifierProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  zoomScale?: number;
  className?: string;
};

export default function ProductImageMagnifier({
  src,
  alt,
  sizes,
  priority = false,
  zoomScale = 2.5,
  className = ""
}: ProductImageMagnifierProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setPosition({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y))
    });
  };

  return (
    <div
      ref={containerRef}
      className={`group relative aspect-square cursor-crosshair overflow-hidden bg-[#1A1A1A] ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Main Image */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-cover transition-opacity duration-200 ${isHovering ? "opacity-0" : "opacity-100"}`}
      />

      {/* Zoomed Image (follows cursor) */}
      {isHovering && (
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url("${src}")`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: `${position.x}% ${position.y}%`
          }}
        />
      )}

      {/* Zoom indicator */}
      <div className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-900/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/85">
        {isHovering ? "Zoomed" : "Hover to zoom"}
      </div>
    </div>
  );
}

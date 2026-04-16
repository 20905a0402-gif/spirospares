"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingActions() {
  const pathname = usePathname();
  const [showTopButton, setShowTopButton] = useState(false);
  const showWhatsapp = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-[70] flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      {showWhatsapp ? (
        <a
          href="https://wa.me/254733959383"
          target="_blank"
          rel="noreferrer"
          aria-label="Contact on WhatsApp"
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.4)]"
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-70 animate-ping" />
          <FaWhatsapp className="h-7 w-7" />
        </a>
      ) : null}

      {showTopButton ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="hidden h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#121212] text-white transition hover:border-[#00BFFF]/60 hover:text-[#00BFFF] md:flex"
        >
          <ChevronUp className="h-6 w-6" />
        </button>
      ) : null}
    </div>
  );
}


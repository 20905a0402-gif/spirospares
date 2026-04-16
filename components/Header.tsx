"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Heart, Search, ShoppingCart } from "lucide-react";
import { quickLinks } from "@/lib/data";
import { useShopStore } from "@/lib/store";
import SiteLogo from "@/components/SiteLogo";
import SiteSearch from "@/components/SiteSearch";
import StockPointLogin from "@/components/StockPointLogin";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useShopStore((state) => state.getCartCount());
  const wishlistCount = useShopStore((state) => state.getWishlistCount());
  const mobileNavRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const scrollMomentum = useRef(0);
  const lastToggleAt = useRef(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isCompactMobileHeader, setIsCompactMobileHeader] = useState(false);
  const [showProductMobileBar, setShowProductMobileBar] = useState(false);

  const isProductShowcasePage = /^\/(bikes|spares|gadgets)\/[^/]+$/.test(pathname);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    setMobileSearchOpen(false);
    setIsCompactMobileHeader(false);
    setShowProductMobileBar(false);
    lastScrollY.current = window.scrollY;
    scrollMomentum.current = 0;
    lastToggleAt.current = 0;
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const now = Date.now();
      const currentY = window.scrollY;
      const previousY = lastScrollY.current;
      const delta = currentY - previousY;

      if (Math.abs(delta) < 2) {
        return;
      }

      const sameDirection = Math.sign(delta) === Math.sign(scrollMomentum.current);
      scrollMomentum.current = sameDirection ? scrollMomentum.current + delta : delta;

      const canToggle = now - lastToggleAt.current > 240;

      if (isProductShowcasePage) {
        if (!showProductMobileBar && canToggle && currentY > 24 && scrollMomentum.current < -24) {
          setShowProductMobileBar(true);
          lastToggleAt.current = now;
          scrollMomentum.current = 0;
        } else if (showProductMobileBar && canToggle && currentY > 90 && scrollMomentum.current > 24) {
          setShowProductMobileBar(false);
          setMobileSearchOpen(false);
          lastToggleAt.current = now;
          scrollMomentum.current = 0;
        }
      } else {
        if (!isCompactMobileHeader && canToggle && currentY > 160 && scrollMomentum.current > 26) {
          setIsCompactMobileHeader(true);
          setMobileSearchOpen(false);
          lastToggleAt.current = now;
          scrollMomentum.current = 0;
        } else if (isCompactMobileHeader && canToggle && (currentY < 72 || scrollMomentum.current < -26)) {
          setIsCompactMobileHeader(false);
          lastToggleAt.current = now;
          scrollMomentum.current = 0;
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isCompactMobileHeader, isProductShowcasePage, showProductMobileBar]);

  useEffect(() => {
    if (isProductShowcasePage || isCompactMobileHeader) {
      setShowSwipeHint(false);
      return;
    }

    const updateSwipeHint = () => {
      const nav = mobileNavRef.current;
      if (!nav) return;

      const isScrollable = nav.scrollWidth - nav.clientWidth > 24;
      const reachedEnd = nav.scrollLeft >= nav.scrollWidth - nav.clientWidth - 12;

      setShowSwipeHint(isScrollable && !reachedEnd);
    };

    updateSwipeHint();
    window.addEventListener("resize", updateSwipeHint);

    return () => {
      window.removeEventListener("resize", updateSwipeHint);
    };
  }, [isCompactMobileHeader, isProductShowcasePage, pathname]);

  const handleMobileNavScroll = () => {
    const nav = mobileNavRef.current;
    if (!nav) return;

    if (nav.scrollLeft > 0) {
      setShowSwipeHint(false);
      return;
    }

    const reachedEnd = nav.scrollLeft >= nav.scrollWidth - nav.clientWidth - 12;
    if (reachedEnd) {
      setShowSwipeHint(false);
      return;
    }

    if (nav.scrollWidth - nav.clientWidth > 24) {
      setShowSwipeHint(true);
    }
  };

  const WishlistButton = ({ compact = false }: { compact?: boolean }) => (
    <Link
      href="/wishlist"
      className={`relative inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${
        compact ? "h-10 w-10" : "h-11 w-11"
      }`}
      aria-label="Open wishlist"
    >
      <Heart className={compact ? "h-4 w-4" : "h-5 w-5"} />
      {wishlistCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[17px] items-center justify-center rounded-full bg-[#00BFFF] px-1 text-[10px] font-bold text-white">
          {wishlistCount}
        </span>
      ) : null}
    </Link>
  );

  const CartButton = ({ compact = false }: { compact?: boolean }) => (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${
        compact ? "h-10 w-10" : "h-11 w-11"
      }`}
      aria-label="Open cart"
    >
      <ShoppingCart className={compact ? "h-4 w-4" : "h-5 w-5"} />
      {cartCount > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[17px] items-center justify-center rounded-full bg-[#00BFFF] px-1 text-[10px] font-bold text-white">
          {cartCount}
        </span>
      ) : null}
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-50 hidden border-b border-white/10 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:block">
        <div className="h-1 w-full bg-[#00BFFF]" />
        <div className="container-shell py-1">
          <div className="grid min-h-[58px] grid-cols-[auto_1fr_auto] items-center gap-4">
            <SiteLogo logoWidth={210} logoHeight={60} />

            <div className="hidden items-center gap-5 lg:flex">
              <nav className="lg:justify-start">
                <ul className="flex min-w-max items-center gap-5 text-sm font-semibold text-gray-300 lg:-ml-4">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        className={`relative pb-1 transition-all duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#00BFFF] after:transition-all after:duration-300 ${
                          isLinkActive(link.href)
                            ? "text-[#00BFFF] after:w-full"
                            : "text-gray-300 hover:text-slate-900 after:w-0 hover:after:w-full"
                        }`}
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <SiteSearch />
            </div>

            <div className="hidden items-center justify-end gap-3 lg:flex">
              <StockPointLogin />
              <WishlistButton />
              <CartButton />
            </div>
          </div>
        </div>
      </header>

      {isProductShowcasePage ? (
        <div className="lg:hidden">
          <div
            className={`fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-white/95 backdrop-blur transition-transform duration-300 ${
              showProductMobileBar ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="h-1 w-full bg-[#00BFFF]" />
            <div className="container-shell py-1.5">
              <div className="grid grid-cols-[40px_1fr_auto] items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-slate-700"
                  aria-label="Back to previous page"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>

                <SiteSearch mobile />

                <div className="flex items-center gap-2">
                  <StockPointLogin compact />
                  <WishlistButton compact />
                  <CartButton compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.08)] lg:hidden">
          <div className="h-1 w-full bg-[#00BFFF]" />
          <div className="container-shell py-1">
            {isCompactMobileHeader ? (
              <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                <SiteSearch mobile />
                <CartButton compact />
              </div>
            ) : (
              <>
                <div className="grid min-h-[56px] grid-cols-[auto_1fr] items-center gap-3">
                  <SiteLogo logoWidth={172} logoHeight={50} />

                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setMobileSearchOpen((previous) => !previous)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white"
                      aria-label="Toggle search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <StockPointLogin compact />
                    <WishlistButton />
                    <CartButton />
                  </div>
                </div>

                {mobileSearchOpen ? (
                  <div className="mt-3">
                    <SiteSearch mobile />
                  </div>
                ) : null}

                <div className="mt-4">
                  <nav
                    ref={mobileNavRef}
                    onScroll={handleMobileNavScroll}
                    className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  >
                    <ul className="flex min-w-max items-center gap-5 pr-3 text-sm font-semibold text-gray-300">
                      {quickLinks.map((link) => (
                        <li key={link.href}>
                          <Link
                            className={`relative pb-1 transition-all duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-px after:bg-[#00BFFF] after:transition-all after:duration-300 ${
                              isLinkActive(link.href)
                                ? "text-[#00BFFF] after:w-full"
                                : "text-gray-300 hover:text-slate-900 after:w-0 hover:after:w-full"
                            }`}
                            href={link.href}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  {showSwipeHint ? (
                    <div className="mt-1 flex justify-end pr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A6200]">
                      <span className="animate-swipe-hint inline-flex items-center gap-1">
                        Swipe right
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </header>
      )}
    </>
  );
}

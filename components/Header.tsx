"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";
import { useShopStore } from "@/lib/store";
import SiteLogo from "@/components/SiteLogo";
import SiteSearch from "@/components/SiteSearch";
import StockPointLogin from "@/components/StockPointLogin";
import { quickLinks } from "@/lib/data";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useShopStore((state) => state.getCartCount());
  const wishlistCount = useShopStore((state) => state.getWishlistCount());
  const lastScrollY = useRef(0);
  const scrollMomentum = useRef(0);
  const lastToggleAt = useRef(0);
  const [isCompactMobileHeader, setIsCompactMobileHeader] = useState(false);
  const [showProductMobileBar, setShowProductMobileBar] = useState(false);

  const isProductShowcasePage = /^\/(bikes|spares|gadgets)\/[^/]+$/.test(pathname);

  useEffect(() => {
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
          lastToggleAt.current = now;
          scrollMomentum.current = 0;
        }
      } else {
        if (!isCompactMobileHeader && canToggle && currentY > 160 && scrollMomentum.current > 26) {
          setIsCompactMobileHeader(true);
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

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const WishlistButton = ({ compact = false }: { compact?: boolean }) => (
    <Link
      href="/wishlist"
      className={`group relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${
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
      className={`group relative inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF] ${
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


  // Desktop Header with integrated NavStrip
  const DesktopHeader = () => (
    <header className="sticky top-0 z-50 hidden bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] lg:block">
      {/* Row 1: Logo + Search + Actions */}
      <div className="container-shell py-2">
        <div className="flex items-center overflow-visible">
          {/* Logo - left (responsive: new on lg, old on smaller) - enlarged with overflow */}
          <div className="flex-shrink-0 scale-125 origin-left">
            <SiteLogo logoWidth={180} logoHeight={50} variant="responsive" />
          </div>

          {/* Spacer to push search to center */}
          <div className="flex-1" />

          {/* Search - centered with increased width */}
          <div className="w-[750px] flex-shrink-0">
            <SiteSearch />
          </div>

          {/* Spacer to push icons to right */}
          <div className="flex-1" />

          {/* Actions column - icons + pbt below - enlarged */}
          <div className="flex flex-col items-center gap-1 flex-shrink-0 scale-110 origin-right">
            <div className="flex items-center gap-2">
              <StockPointLogin />
              <WishlistButton />
              <CartButton />
            </div>
            {/* Powered by Tamtech pill - styled like hero tagline, smaller */}
            <div className="w-[148px] flex justify-center">
              <span 
                className="inline-flex items-center rounded-full border border-[#00BFFF]/30 bg-[#dff5ff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#0369a1] whitespace-nowrap"
              >
                Powered by Tamtech
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Cyan Nav Strip - centered */}
      <nav className="bg-[#00BFFF]">
        <div className="container-shell">
          <ul className="flex items-center justify-center gap-1 py-1.5 text-sm font-semibold">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative inline-flex items-center px-4 py-1 rounded-full transition-all duration-300 ease-out whitespace-nowrap ${
                    isLinkActive(link.href)
                      ? 'bg-white text-[#0080A0] shadow-sm'
                      : 'text-white hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );

  // Mobile Header with integrated NavStrip
  // Mobile Header with Swipe Detection
  const MobileHeaderWithSwipe = () => {
    const [hasSwiped, setHasSwiped] = useState(false)
    const [mounted, setMounted] = useState(false)
    const navRef = useRef<HTMLUListElement>(null)

    useEffect(() => {
      setMounted(true)
      const stored = localStorage.getItem('spiro_nav_swiped')
      if (stored === 'true') {
        setHasSwiped(true)
      }
    }, [])

    useEffect(() => {
      const nav = navRef.current
      if (!nav || hasSwiped) return

      const handleScroll = () => {
        if (nav.scrollLeft > 20) {
          setHasSwiped(true)
          localStorage.setItem('spiro_nav_swiped', 'true')
        }
      }

      nav.addEventListener('scroll', handleScroll, { passive: true })
      return () => nav.removeEventListener('scroll', handleScroll)
    }, [hasSwiped])

    return (
      <header className="sticky top-0 z-50 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.08)] lg:hidden">
        {/* Row 1: Logo + Actions */}
        <div className="container-shell py-2">
          {isCompactMobileHeader ? (
            // Compact mode - just search and cart
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <SiteSearch mobile />
              </div>
              <CartButton compact />
            </div>
          ) : (
            // Full mode
            <>
              <div className="flex items-center justify-between gap-2">
                <SiteLogo logoWidth={100} logoHeight={26} />
                <div className="flex items-center gap-2">
                  <StockPointLogin compact />
                  <WishlistButton compact />
                  <CartButton compact />
                </div>
              </div>
              
              {/* Search bar - full width below logo */}
              <div className="mt-2">
                <SiteSearch mobile />
              </div>
            </>
          )}
        </div>

        {/* Row 2: Cyan Nav Strip with swipe hint */}
        <nav className="bg-[#00BFFF] relative">
          <div className="container-shell">
            <div className="flex items-center">
              <ul 
                ref={navRef}
                className="flex items-center gap-1 py-2.5 text-xs font-semibold overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1"
              >
                {quickLinks.map((link) => (
                  <li key={link.href} className="flex-shrink-0">
                    <Link
                      href={link.href}
                      className={`relative inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-300 ease-out whitespace-nowrap ${
                        isLinkActive(link.href)
                          ? 'bg-white text-[#0080A0] shadow-sm'
                          : 'text-white hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Swipe right indicator - hidden after swipe (only on client) */}
              {mounted && !hasSwiped && (
                <div className="flex-shrink-0 pl-2 border-l border-white/30 ml-1 animate-pulse">
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
                    Swipe <span className="hidden xs:inline">Right</span> →
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Fade effect on right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#00BFFF] to-transparent pointer-events-none lg:hidden" />
        </nav>
      </header>
    )
  }

  const MobileHeader = () => (
    <>
      {isProductShowcasePage ? (
        // Product page mobile header (compact back button bar)
        <div
          className={`fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-white/95 backdrop-blur transition-transform duration-300 lg:hidden ${
            showProductMobileBar ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="h-1 w-full bg-[#00BFFF]" />
          <div className="container-shell py-2">
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
      ) : (
        // Standard mobile header
        <MobileHeaderWithSwipe />
      )}
    </>
  );

  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
}

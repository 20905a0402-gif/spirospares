import Image from "next/image";
import Link from "next/link";
import spiroSparesLogo from "@/images/spirologo_tmt.png";

type SiteLogoProps = {
  className?: string;
  logoWidth?: number;
  logoHeight?: number;
  textSizeClass?: string;
  showWordmark?: boolean;
  variant?: "default" | "responsive";
};

export default function SiteLogo({
  className = "",
  logoWidth = 220,
  logoHeight = 72,
  textSizeClass = "text-lg md:text-xl",
  showWordmark = false,
  variant = "default"
}: SiteLogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-3 ${className}`} aria-label="SPIRO SPARES home">
      {variant === "responsive" ? (
        <>
          {/* Old logo for small screens */}
          <Image
            src={spiroSparesLogo}
            alt="SPIRO SPARES logo"
            width={logoWidth}
            height={logoHeight}
            className="h-auto object-contain lg:hidden"
            priority
          />
          {/* New logo for large screens */}
          <Image
            src="/SPIROSPARE_LOGO.png"
            alt="SPIRO SPARES logo"
            width={logoWidth}
            height={logoHeight}
            className="h-auto object-contain hidden lg:block"
            priority
          />
        </>
      ) : (
        <Image
          src={spiroSparesLogo}
          alt="SPIRO SPARES logo"
          width={logoWidth}
          height={logoHeight}
          className="h-auto object-contain"
          priority
        />
      )}
      {showWordmark ? (
        <span className={`font-bold tracking-tight text-white ${textSizeClass}`} style={{ fontFamily: "var(--font-heading)" }}>
          SPIRO <span className="text-[#00A3FF] drop-shadow-[0_0_8px_rgba(181,189,200,0.5)]">SPARES</span>
        </span>
      ) : null}
    </Link>
  );
}

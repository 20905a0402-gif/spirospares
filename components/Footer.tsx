import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { quickLinks } from "@/lib/data";
import SiteLogo from "@/components/SiteLogo";

const footerQuickLinkLabels = new Set([
  "Bikes",
  "Spares",
  "Gadgets",
  "About Us",
  "Contact"
]);

const footerQuickLinks = quickLinks.filter((link) => footerQuickLinkLabels.has(link.label));

const policyLinks = [
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Delivery Information", href: "/delivery-information" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "Warranty Policy", href: "/warranty-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Cookie Policy", href: "/cookie-policy" }
];

export default function Footer() {
  return (
    <footer className="border-t border-[#0b1325] bg-[radial-gradient(circle_at_22%_-28%,rgba(0,191,255,0.24),transparent_48%),linear-gradient(180deg,#0f172a_0%,#0b1220_100%)] text-[#e2e8f0]">
      <div className="container-shell pt-12">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 xl:grid-cols-[1.15fr_0.9fr_1fr_1fr_1.1fr]">
          <article>
            <SiteLogo logoWidth={220} logoHeight={70} />
            <p className="mt-4 text-sm leading-6 text-[#94a3b8]">
                SPIRO SPARES powers riders with reliable bikes, genuine spares, and service continuity across Kenya.
            </p>
            <div className="mt-5 flex items-center gap-3 text-[#cbd5e1]">
              <a
                aria-label="WhatsApp"
                className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
                href="https://wa.me/254733959383"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                aria-label="Facebook"
                className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>
              <a
                aria-label="Instagram"
                className="rounded-full border border-white/20 bg-white/5 p-2 transition hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </article>

          <article>
            <h3 className="text-lg font-semibold tracking-tight text-[#f8fafc]">Quick Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#94a3b8]">
              {footerQuickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-all duration-300 ease-out hover:text-[#00BFFF]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h3 className="text-lg font-semibold tracking-tight text-[#f8fafc]">Policies</h3>
            <ul className="mt-4 space-y-2 text-sm text-[#94a3b8]">
              {policyLinks.map((policyLink) => (
                <li key={policyLink.href}>
                  <Link href={policyLink.href} className="transition-all duration-300 ease-out hover:text-[#00BFFF]">
                    {policyLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h3 className="text-lg font-semibold tracking-tight text-[#f8fafc]">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#94a3b8]">
              <li className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#00BFFF]" /> +254 733 959 383
              </li>
              <li className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#00BFFF]" /> support@spirospares.co.ke
              </li>
              <li className="inline-flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[#00BFFF]" />
                Dunga Close, Industrial Area, Nairobi
              </li>
            </ul>
          </article>

          <article className="h-[240px] overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="SPIRO SPARES Nairobi map"
              src="https://www.google.com/maps?q=Dunga+Close+Industrial+Area+Nairobi&output=embed"
              className="block h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </article>
        </div>

        <div className="pt-4 text-center text-xs text-[#94a3b8]">
          Copyright {new Date().getFullYear()} SPIRO SPARES. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

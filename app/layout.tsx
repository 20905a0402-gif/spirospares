import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { getSiteUrl } from "@/lib/siteUrl";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading"
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body"
});

export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "SPIRO SPARES",
    template: "%s | SPIRO SPARES Kenya"
  },
  description:
    "Buy genuine Spiro EV spares, smart riding gadgets, and locate battery swapping & service centers in Nairobi and across Kenya. Keep your electric bike moving with fast delivery.",
  keywords: [
    "Spiro EV spares Kenya",
    "Spiro battery swapping Nairobi",
    "electric bike parts",
    "TamTech EV Solutions",
    "Spiro add-ons and gadgets"
  ],
  openGraph: {
    title: "SPIRO SPARES",
    description:
      "Reliable EV bikes, genuine spares, and smart rider solutions for Nairobi and across Kenya.",
    locale: "en_KE",
    type: "website"
  },
  icons: {
    icon: "/SPIROSPARE_LOGO.png",
    shortcut: "/SPIROSPARE_LOGO.png",
    apple: "/SPIROSPARE_LOGO.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${bodyFont.variable} bg-[#f8fafc] text-slate-900 antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
import Link from "next/link";
import { Home, MapPin, ChevronRight } from "lucide-react";
import TextWithEVHighlight from "@/components/TextWithEVHighlight";

type Breadcrumb = {
  label: string;
  href?: string;
};

type HeroBannerProps = {
  title: string;
  subtitle: string;
  breadcrumbs: Breadcrumb[];
};

export default function HeroBanner({ title, subtitle, breadcrumbs }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00BFFF]/20 via-[#f8fafc] to-[#e9f2ff]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="container-shell relative py-4 md:py-5">
        <nav aria-label="Breadcrumb" className="mb-2 text-[10px] uppercase tracking-[0.14em] text-gray-400 md:text-xs">
          <ol className="flex flex-wrap items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={breadcrumb.label} className="flex items-center gap-2">
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href} className="inline-flex items-center gap-1.5 transition hover:text-[#00BFFF]">
                    {index === 0 && <Home className="h-3 w-3" />}
                    {index === 1 && breadcrumb.label.toLowerCase().includes("pickup") && <MapPin className="h-3 w-3" />}
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-gray-300">
                    {breadcrumb.label.toLowerCase().includes("pickup") && <MapPin className="h-3 w-3" />}
                    {breadcrumb.label}
                  </span>
                )}
                {index !== breadcrumbs.length - 1 ? <ChevronRight className="h-3 w-3 text-gray-600" /> : null}
              </li>
            ))}
          </ol>
        </nav>

        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-4xl">
          <TextWithEVHighlight text={title} />
        </h1>
        <p className="mt-2 max-w-3xl text-xs text-gray-400 md:text-sm">{subtitle}</p>
      </div>
    </section>
  );
}


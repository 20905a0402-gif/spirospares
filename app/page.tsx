import Link from "next/link";
import Image from "next/image";
import BikeCard from "@/components/cards/BikeCard";
import SpareCard from "@/components/cards/SpareCard";
import GadgetCard from "@/components/cards/GadgetCard";
import TextWithEVHighlight from "@/components/TextWithEVHighlight";
import HeroDeliveryTagline from "@/components/HeroDeliveryTagline";
import { getLegacyBikes, getLegacyGadgets, getLegacySpareParts } from "@/lib/sanity/queries-data";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SPIRO SPARES",
  image: "https://tamtechev.co.ke/og-image.jpg",
  telephone: "+254733959383",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dunga Close, Near Car & General Roundabout, Industrial Area",
    addressLocality: "Nairobi",
    addressCountry: "KE"
  },
  openingHours: "Mo-Sa 08:00-18:00",
  areaServed: "Nairobi and Kenya"
};

const categories = [
  {
    title: "Bikes",
    summary: "Reliable electric bikes for riders, fleets, and businesses.",
    href: "/bikes"
  },
  {
    title: "Spares",
    summary: "Genuine Spiro parts for uptime and downtime reduction.",
    href: "/spares"
  },
  {
    title: "Gadgets",
    summary: "Smart rider add-ons for safety, charging, and security.",
    href: "/gadgets"
  },
  {
    title: "Service Center",
    summary: "Repair support and battery swapping touch points near you.",
    href: "/services"
  }
];

const advantages = [
  "Genuine Products",
  "Fast Moving Inventory",
  "Battery Swapping Network Support",
  "Same-Day Dispatch in Nairobi",
  "Technical Fitment Guidance",
  "Fleet-Focused Service"
];

export default async function HomePage() {
  const [bikes, spareParts, gadgets] = await Promise.all([
    getLegacyBikes(),
    getLegacySpareParts(),
    getLegacyGadgets(),
  ]);

  const featuredLimits = { sparesLimit: 14, gadgetsLimit: 14 };
  const featuredSpares = spareParts.slice(0, featuredLimits.sparesLimit);
  const featuredGadgets = gadgets.slice(0, featuredLimits.gadgetsLimit);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <section className="relative min-h-[80vh] overflow-hidden border-b border-white/10">
        <Image
          src="/images/spiro_herobg.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/88 via-[#f8fafc]/68 to-[#eef2ff]/82" />
        <div className="absolute inset-y-0 left-0 w-[72%] bg-gradient-to-r from-[#f8fafc]/96 via-[#f8fafc]/82 to-transparent" />
        <div className="absolute inset-0 opacity-18 [background-image:linear-gradient(rgba(15,23,42,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.07)_1px,transparent_1px)] [background-size:58px_58px]" />
        <div className="container-shell relative flex min-h-[80vh] items-center py-20">
          <div className="animate-rise max-w-5xl">
            <p
              className="inline-flex rounded-full border border-white/55 bg-black/35 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: "#ffffff", textShadow: "0 2px 10px rgba(168, 104, 104, 0.85)" }}
            >
              SPIRO SPARES
            </p>
            <h1 className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-5xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(248,250,252,0.65)] md:text-7xl lg:text-8xl">
              <span>
                Spares at Your <span className="doorstep-shimmer">Doorstep</span>. <span className="text-[0.5em] font-bold uppercase tracking-[0.08em] text-[#8A6200] md:text-[0.46em]"><HeroDeliveryTagline /></span>
              </span>
            </h1>
            <p
              className="mt-6 max-w-2xl text-base font-semibold md:text-lg"
              style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.88)" }}
            >
              From electric bikes to fast-moving spares and service support, SPIRO SPARES helps delivery riders in Nairobi scale with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/bikes"
                className="rounded-full bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
              >
                Shop Bikes
              </Link>
              <Link
                href="/spares"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              >
                Browse Spares
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              >
                Find Service Center
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-6 md:py-10">
        <h2 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          <TextWithEVHighlight text="Select a Model " />
        </h2>
        <p className="mt-2 text-gray-400">To jump directly into compatible spares and keep moving.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bikes.filter((bike) => bike.name !== "COMMANDO").map((bike) => (
            <BikeCard
              key={bike.id}
              bike={bike}
              href={`/spares?model=${encodeURIComponent(bike.name)}`}
              showDescription={false}
              showPrice={false}
              selectorOnly
            />
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Shop by Category
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="panel group relative min-h-[170px] overflow-hidden p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50 hover:shadow-[inset_0_0_28px_rgba(0, 191, 255,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/0 via-transparent to-[#4B5563]/0 transition duration-300 group-hover:from-[#00BFFF]/10 group-hover:to-[#4B5563]/10" />
              <h3 className="relative text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                {category.title}
              </h3>
              <p className="relative mt-2 max-w-md text-sm text-gray-400">{category.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Featured Products
        </h2>

        <h3 className="mt-8 text-xl font-bold text-gray-200">Top Spares</h3>
        <div className="catalog-grid-compact mt-3">
          {featuredSpares.map((part) => (
            <SpareCard key={part.id} part={part} compact />
          ))}
        </div>

        <h3 className="mt-8 text-xl font-bold text-gray-200">Smart Gadgets</h3>
        <div className="catalog-grid-compact mt-3">
          {featuredGadgets.map((gadget) => (
            <GadgetCard key={gadget.id} gadget={gadget} compact />
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Why Choose Us
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage) => (
            <article
              key={advantage}
              className="panel flex items-start gap-4 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50"
            >
              <div className="mt-1 h-3 w-3 rounded-full bg-green" />
              <div>
                <h3 className="text-lg font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  {advantage}
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Built to support electric mobility growth with quality parts and practical after-sales support.
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-shell py-6 md:py-8">
        <div className="panel bg-gradient-to-r from-[#f8fafc] to-[#e2e8f0] p-6 md:flex md:items-center md:justify-between md:gap-8 md:p-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:whitespace-nowrap md:text-3xl lg:text-4xl" style={{ fontFamily: "var(--font-heading)" }}>
              Need a service center for your bike?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-400 md:text-base">Find SPIRO service centers and keep your bike running at peak performance.</p>
          </div>
          <Link
            href="/services"
            className="mt-4 inline-flex rounded-full bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)] md:mt-0"
          >
            Explore Service Centers
          </Link>
        </div>
      </section>
    </>
  );
}

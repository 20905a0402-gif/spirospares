// ISR: Revalidate every 60 seconds to pick up Sanity changes
export const revalidate = 60;

import Link from "next/link";
import Image from "next/image";
import { Clock3, MapPin } from "lucide-react";
import BikeCard from "@/components/cards/BikeCard";
import SpareCard from "@/components/cards/SpareCard";
import GadgetCard from "@/components/cards/GadgetCard";
import TextWithEVHighlight from "@/components/TextWithEVHighlight";
import HeroDeliveryTagline from "@/components/HeroDeliveryTagline";
import ScrollButton from "@/components/ScrollButton";
import { getLegacyBikes, getLegacyGadgets, getLegacyServiceLocations, getLegacySpareParts } from "@/lib/sanity/queries-data";
import { getSiteUrl } from "@/lib/siteUrl";
import heroBg2 from "@/images/hero_section/bg2.png";
import heroBg3 from "@/images/hero_section/bg3.png";
import heroBg4 from "@/images/hero_section/bg4.jpeg";
import m1Banner from "@/images/m1_banner.png";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SPIRO SPARES",
  image: `${getSiteUrl()}/og-image.jpg`,
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
  const [bikes, spareParts, gadgets, pickupLocations] = await Promise.all([
    getLegacyBikes(),
    getLegacySpareParts(),
    getLegacyGadgets(),
    getLegacyServiceLocations(),
  ]);

  const featuredLimits = { sparesLimit: 14, gadgetsLimit: 14 };
  const inStockSpares = spareParts.filter((part) => part.stock > 0 && part.compatible_models.includes("EKON450M2V2"));
  const inStockGadgets = gadgets.filter((gadget) => (gadget.stock ?? 0) > 0);
  const featuredSpares = inStockSpares.slice(0, featuredLimits.sparesLimit);
  const featuredGadgets = inStockGadgets.slice(0, featuredLimits.gadgetsLimit);
  const heroSlides = ["/images/spiro_herobg.png", heroBg2, heroBg3, heroBg4];
  // Sort to show Industrial Area first, then limit to 4
  const sortedPickupLocations = [...pickupLocations].sort((a, b) => {
    const aIsIndustrial = a.name.toLowerCase().includes("industrial") || a.area.toLowerCase().includes("industrial");
    const bIsIndustrial = b.name.toLowerCase().includes("industrial") || b.area.toLowerCase().includes("industrial");
    if (aIsIndustrial && !bIsIndustrial) return -1;
    if (!aIsIndustrial && bIsIndustrial) return 1;
    return 0;
  });
  const pickupPoints = sortedPickupLocations.slice(0, 4);

  const normalizedName = (value: string) => value.trim().toUpperCase();
  const modelSelectionPreferences = [
    ["EKON450M1V1", "EKCON450M1V1", "450M1V1"],
    ["EKON450M1V2", "EKCON450M1V2", "450M1V2"],
    ["VEO"],
    ["EKON400M1", "EKCON400M1", "400M1"]
  ];

  const selectedModelCards = modelSelectionPreferences
    .map((tokens) =>
      bikes.find((bike) => {
        const bikeName = normalizedName(bike.name);
        return tokens.some((token) => bikeName.includes(token));
      })
    )
    .filter((bike): bike is (typeof bikes)[number] => Boolean(bike))
    .filter((bike, index, collection) => collection.findIndex((candidate) => candidate.id === bike.id) === index);

  const modelOrder = ["EKON450M1V2", "EKON450M2V2", "EKON450M3", "VEO", "EKON450M1", "EKON400M2"];
  const modelCards = modelOrder
    .map((name) => bikes.find((bike) => bike.name === name))
    .filter((bike): bike is (typeof bikes)[number] => Boolean(bike));

  const m1Bike = bikes.find((bike) => {
    const name = normalizedName(bike.name);
    return name.includes("EKON450M1") || name.includes("EKON400M1") || name.endsWith("M1");
  }) ?? bikes[0];
  const m1ShowcaseHref = m1Bike ? `/bikes/${m1Bike.id}` : "/bikes";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />

      <section className="relative min-h-[80vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={`${index}-${typeof slide === "string" ? slide : slide.src}`}
              className="hero-slide-layer absolute inset-0"
              style={{ animationDelay: `${index * 6}s` }}
            >
              <Image
                src={slide}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-slide-image object-cover object-center"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fafc]/88 via-[#f8fafc]/68 to-[#eef2ff]/82" />
        <div className="absolute inset-y-0 left-0 w-[72%] bg-gradient-to-r from-[#f8fafc]/96 via-[#f8fafc]/82 to-transparent" />
        <div className="container-shell relative flex min-h-[80vh] items-center py-20">
          <div className="animate-rise max-w-5xl">
            <p
              className="hero-brand-pill inline-flex rounded-full border px-4 py-1 text-xs font-black uppercase tracking-[0.26em]"
              style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(2, 6, 23, 0.85)" }}
            >
              SPIRO SPARES
            </p>
            <h1 className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2 text-5xl font-extrabold leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(248,250,252,0.65)] md:text-7xl lg:text-8xl">
              <span>Spares at Your <span className="text-[#00BFFF]">Doorstep</span>.</span>
            </h1>
            <p className="mt-4">
              <HeroDeliveryTagline />
            </p>
            <p
              className="mt-6 max-w-2xl text-base font-semibold md:text-lg"
              style={{ color: "#ffffff", textShadow: "0 2px 12px rgba(0,0,0,0.88)" }}
            >
              From electric bikes to fast-moving spares, SPIRO SPARES helps delivery riders in Nairobi scale with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/bikes"
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
              >
                Shop Bikes
              </Link>
              <Link
                href="/spares"
                className="rounded-full bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
              >
                Browse Spares
              </Link>
            </div>
          </div>
        </div>
        <ScrollButton />
      </section>

      <section className="container-shell py-6 md:py-10">
        <h2 className="text-3xl font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
          <TextWithEVHighlight text="Select a Model " />
        </h2>
        <p className="mt-2 text-gray-400">To jump directly into compatible spares and keep moving.</p>

        <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {modelCards.map((bike) => (
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
        <h2 className="text-3xl font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
          Shop by Category
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="panel group relative min-h-[170px] overflow-hidden p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50 hover:shadow-[inset_0_0_28px_rgba(0, 191, 255,0.08)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00BFFF]/0 via-transparent to-[#4B5563]/0 transition duration-300 group-hover:from-[#00BFFF]/10 group-hover:to-[#4B5563]/10" />
              <h3 className="relative text-xl font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
                {category.title}
              </h3>
              <p className="relative mt-2 max-w-md text-sm text-gray-400">{category.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
          Featured Products
        </h2>

        <h3 className="mt-8 text-xl font-bold text-[#00BFFF]">Top Spares</h3>
        <div className="catalog-grid-compact mt-3">
          {featuredSpares.map((part) => (
            <SpareCard key={part.id} part={part} compact />
          ))}
        </div>

        <h3 className="mt-8 text-xl font-bold text-[#00BFFF]">Smart Gadgets</h3>
        <div className="catalog-grid-compact mt-3">
          {featuredGadgets.map((gadget) => (
            <GadgetCard key={gadget.id} gadget={gadget} compact />
          ))}
        </div>
      </section>

      <section className="container-shell py-8 md:py-12">
        <h2 className="text-3xl font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
          Why Choose Us
        </h2>
        <div className="mt-5 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((advantage) => (
            <article
              key={advantage}
              className="panel flex items-start gap-4 p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50"
            >
              <div className="mt-1 h-3 w-3 rounded-full bg-green" />
              <div>
                <h3 className="text-lg font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
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

      <section className="py-4 md:py-8">
        <Link href={m1ShowcaseHref} className="group block">
          <div className="relative h-[180px] w-full overflow-hidden border-y border-white/10 sm:h-[240px] md:h-[320px] lg:h-[400px]">
            <Image
              src={m1Banner}
              alt="Spiro M1 mobility banner"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/25 via-transparent to-[#0f172a]/25" />
          </div>
        </Link>
      </section>

      <section className="container-shell pb-8 pt-2 md:pb-12 md:pt-4">
        <div className="panel overflow-hidden p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00BFFF]">Pickup Network</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#00BFFF]" style={{ fontFamily: "var(--font-heading)" }}>
                Pickup Points Available
              </h2>
            </div>
            <p className="max-w-xl text-sm text-gray-400">Choose the nearest pickup location at checkout and collect your order when it suits your route schedule.</p>
          </div>

          <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
            {pickupPoints.map((pickupPoint) => (
              <Link
                key={pickupPoint.name}
                href={`/services/${pickupPoint.id}`}
                className="relative rounded-2xl border border-white/15 bg-[linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)] p-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/55"
              >
                <div className="absolute right-3 top-3 rounded-full bg-[#00BFFF]/12 p-2 text-[#0284c7]">
                  <MapPin className="h-4 w-4" />
                </div>
                <h3 className="pr-10 text-base font-bold text-slate-900">{pickupPoint.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{pickupPoint.area}, {pickupPoint.city}</p>
                <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0284c7]">
                  <Clock3 className="h-3.5 w-3.5" />
                  {pickupPoint.hours}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <Link
              href="/services"
              className="inline-flex rounded-full bg-[#00BFFF] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
            >
              View All Pickup Points
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

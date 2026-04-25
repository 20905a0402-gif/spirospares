import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import { formatKES } from "@/lib/data";
import { bikesPageModelTargets, findBikeByTokens } from "@/lib/modelTargets";
import { getLegacyBikes } from "@/lib/sanity/queries-data";

export const metadata: Metadata = {
  title: "Bikes",
  description:
    "Explore Spiro electric bike models in Kenya with specs, pricing, and service-ready options for commuters and commercial riders."
};

export default async function BikesPage() {
  const bikes = await getLegacyBikes();

  const defaultBike = bikes[0];

  const displayModels = bikesPageModelTargets
    .map((target) => {
      const matchedBike = findBikeByTokens(bikes, target.searchTokens, target.fallbackTokens) ?? defaultBike;
      if (!matchedBike) {
        return null;
      }

      return {
        bike: matchedBike,
        displayName: target.label
      };
    })
    .filter((model): model is { bike: (typeof bikes)[number]; displayName: string } => Boolean(model));

  return (
    <>
      <HeroBanner
        title="Premium Bikes for Kenya"
        subtitle="Compare fleet-ready electric bikes designed for delivery scale, rider comfort, and rapid battery swapping."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bikes" }]}
      />

      <section className="container-shell py-10">
        <div className="grid gap-5 sm:grid-cols-2">
          {displayModels.map((model, index) => (
            <article key={`${model.displayName}-${model.bike.id}`} className="panel group relative flex h-full flex-col overflow-hidden">
              <Link
                href={`/bikes/${model.bike.id}`}
                aria-label={`View ${model.displayName}`}
                className="absolute inset-0 z-10"
              />
              <div className="pointer-events-none relative aspect-[4/3] bg-[#1A1A1A]">
                  <Image
                    src={model.bike.images[0]}
                    alt={`${model.displayName} bike spotlight image`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="pointer-events-none relative z-20 flex flex-1 flex-col p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#00BFFF]">Top Model</p>
                  <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{model.displayName}</h1>
                  <p className="mt-3 text-gray-400">{model.bike.short_description}</p>

                  <div className="mt-5 flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white">{formatKES(model.bike.price)}</p>
                    <p className="text-sm uppercase tracking-wide text-gray-500">{model.bike.SKU}</p>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
                    <p>Motor: {model.bike.motor}</p>
                    <p>Range: {model.bike.range}</p>
                    <p>Battery: {model.bike.battery}</p>
                    <p>Top Speed: {model.bike.speed}</p>
                  </div>

                  <div className="pointer-events-auto mt-10 border-t border-white/10 pt-6 sm:mt-auto">
                    <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/bikes/${model.bike.id}`}
                      className="rounded-xl bg-[#00BFFF] px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
                    >
                      View
                    </Link>
                    <Link
                      href={`/spares?model=${encodeURIComponent(model.displayName)}`}
                      className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
                    >
                      View Compatible Spares
                    </Link>
                    </div>
                  </div>
                </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="panel p-5">
            <h3 className="text-lg font-bold text-white">Launch Performance Engineering</h3>
            <p className="mt-2 text-sm text-gray-400">
              Designed for fleet-grade output with optimized torque delivery and fast recovery cycles between routes.
            </p>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-bold text-white">Built for Daily Commerce</h3>
            <p className="mt-2 text-sm text-gray-400">
              Every model is configured for rider uptime, low operating costs, and scalable business usage.
            </p>
          </article>
          <article className="panel p-5">
            <h3 className="text-lg font-bold text-white">After-Sales Continuity</h3>
            <p className="mt-2 text-sm text-gray-400">
              Integrated support through the spares supply chain and nationwide service network.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}

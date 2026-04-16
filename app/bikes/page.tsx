import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import HeroBanner from "@/components/HeroBanner";
import { formatKES } from "@/lib/data";
import { getLegacyBikes } from "@/lib/sanity/queries-data";

export const metadata: Metadata = {
  title: "Bikes",
  description:
    "Explore Spiro electric bike models in Kenya with specs, pricing, and service-ready options for commuters and commercial riders."
};

export default async function BikesPage() {
  const bikes = await getLegacyBikes();

  const preferredTopModels = ["EKON400M2", "EKON400M1"] as const;
  const selectedTopModels = preferredTopModels
    .map((modelName) => bikes.find((bike) => bike.name === modelName))
    .filter((bike): bike is (typeof bikes)[number] => Boolean(bike));

  const topModels = selectedTopModels.length >= 2
    ? selectedTopModels.slice(0, 2)
    : [
        ...selectedTopModels,
        ...bikes.filter((bike) => !selectedTopModels.some((selectedBike) => selectedBike.id === bike.id))
      ].slice(0, 2);

  return (
    <>
      <HeroBanner
        title="Premium Bikes for Kenya"
        subtitle="Compare fleet-ready electric bikes designed for delivery scale, rider comfort, and rapid battery swapping integration."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bikes" }]}
      />

      <section className="container-shell py-10">
        <div className="grid gap-5">
          {topModels.map((bike, index) => (
            <article key={bike.id} className="panel overflow-hidden">
              <div className="grid lg:grid-cols-2">
                <div className="relative min-h-[300px] bg-[#1A1A1A] md:min-h-[420px]">
                  <Image
                    src={bike.images[0]}
                    alt={`${bike.name} bike spotlight image`}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#00BFFF]">Top Model</p>
                  <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white md:text-4xl">{bike.name}</h1>
                  <p className="mt-3 text-gray-400">{bike.short_description}</p>

                  <div className="mt-5 flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-white">{formatKES(bike.price)}</p>
                    <p className="text-sm uppercase tracking-wide text-gray-500">{bike.SKU}</p>
                  </div>

                  <div className="mt-5 grid gap-2 text-sm text-gray-300 sm:grid-cols-2">
                    <p>Motor: {bike.motor}</p>
                    <p>Range: {bike.range}</p>
                    <p>Battery: {bike.battery}</p>
                    <p>Top Speed: {bike.speed}</p>
                  </div>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Link
                      href={`/bikes/${bike.id}`}
                      className="rounded-xl bg-[#00BFFF] px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/spares?model=${encodeURIComponent(bike.name)}`}
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

import { Metadata } from "next";
import Link from "next/link";
import { Clock3, MapPin, Navigation } from "lucide-react";
import HeroBanner from "@/components/HeroBanner";
import { getLegacyServiceLocations } from "@/lib/sanity/queries-data";

export const metadata: Metadata = {
  title: "Pickup Points",
  description: "Find official Spiro Spares pickup points with location details and map access."
};

export default async function ServicesPage() {
  const pickupPoints = await getLegacyServiceLocations();

  return (
    <>
      <HeroBanner
        title="Pickup Points"
        subtitle="Choose your nearest pickup location and open the map instantly for easier collection planning."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pickup Points" }]}
      />

      <section className="container-shell py-8 md:py-10">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pickupPoints.map((pickupPoint) => (
            <Link
              key={pickupPoint.id}
              href={`/services/${pickupPoint.id}`}
              className="panel group relative overflow-hidden p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/55"
            >
              <div className="absolute right-4 top-4 rounded-full bg-[#00BFFF]/10 p-2 text-[#0284c7]">
                <Navigation className="h-4 w-4" />
              </div>

              <h2 className="pr-12 text-lg font-bold tracking-tight text-white">{pickupPoint.name}</h2>
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4 text-[#00BFFF]" />
                {pickupPoint.area}, {pickupPoint.city}
              </p>
              <p className="mt-2 text-sm text-gray-500">{pickupPoint.address}</p>
              <p className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#0284c7]">
                <Clock3 className="h-3.5 w-3.5" />
                {pickupPoint.hours}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
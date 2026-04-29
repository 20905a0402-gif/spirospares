// ISR: Revalidate every 60 seconds to pick up Sanity changes
export const revalidate = 60;

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Home, MapPin, ChevronRight, MapPinned, Clock, Phone } from "lucide-react";
import { getLegacyServiceLocationById, getLegacyServiceLocations } from "@/lib/sanity/queries-data";

type PickupPointDetailPageProps = {
  params: {
    locationId: string;
  };
};

export async function generateStaticParams() {
  const pickupPoints = await getLegacyServiceLocations();
  return pickupPoints.map((pickupPoint) => ({ locationId: pickupPoint.id }));
}

export async function generateMetadata({ params }: PickupPointDetailPageProps): Promise<Metadata> {
  const pickupPoint = await getLegacyServiceLocationById(params.locationId);

  if (!pickupPoint) {
    return { title: "Pickup Point Not Found" };
  }

  return {
    title: `${pickupPoint.name} - Pickup Point`,
    description: `${pickupPoint.name}, ${pickupPoint.address}. View map and collection hours for this pickup point.`
  };
}

export default async function ServiceDetailPage({ params }: PickupPointDetailPageProps) {
  const pickupPoint = await getLegacyServiceLocationById(params.locationId);

  if (!pickupPoint) {
    notFound();
  }

  return (
    <section className="container-shell py-8 md:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs uppercase tracking-[0.14em] text-gray-500">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="inline-flex items-center gap-1.5 transition hover:text-[#00BFFF]">
              <Home className="h-3 w-3" />
              Home
            </Link>
          </li>
          <li><ChevronRight className="h-3 w-3 text-gray-600" /></li>
          <li>
            <Link href="/services" className="inline-flex items-center gap-1.5 transition hover:text-[#00BFFF]">
              <MapPin className="h-3 w-3" />
              Pickup Points
            </Link>
          </li>
          <li><ChevronRight className="h-3 w-3 text-gray-600" /></li>
          <li className="inline-flex items-center gap-1.5 text-gray-400">
            <MapPin className="h-3 w-3" />
            {pickupPoint.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <article className="panel p-5 md:p-6">
          <h1 className="text-3xl font-bold tracking-tight text-white">{pickupPoint.name}</h1>

          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPinned className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00BFFF]" />
              <span>
                <span className="font-semibold text-white">Address:</span> {pickupPoint.address}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00BFFF]" />
              <span>
                <span className="font-semibold text-white">Hours:</span> {pickupPoint.hours}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00BFFF]" />
              <span>
                <span className="font-semibold text-white">Phone:</span> {pickupPoint.phone}
              </span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={pickupPoint.map_link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-[#00BFFF] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
            >
              Open in Maps
            </a>
            <Link
              href="/services"
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
            >
              All Pickup Points
            </Link>
          </div>
        </article>

        <article className="panel overflow-hidden">
          <iframe
            title={`Pickup map for ${pickupPoint.name}`}
            src={pickupPoint.map_link}
            width="100%"
            height="100%"
            className="min-h-[380px] md:min-h-[480px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </article>
      </div>
    </section>
  );
}
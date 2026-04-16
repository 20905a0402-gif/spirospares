import { Metadata } from "next";
import { notFound } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getLegacyServiceLocationById, getLegacyServiceLocations } from "@/lib/sanity/queries-data";

type ServiceDetailPageProps = {
  params: {
    locationId: string;
  };
};

export async function generateStaticParams() {
  const locations = await getLegacyServiceLocations();
  return locations.map((location) => ({ locationId: location.id }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const location = await getLegacyServiceLocationById(params.locationId);

  if (!location) {
    return { title: "Location Not Found" };
  }

  return {
    title: `${location.name} - Spiro Service Nairobi`,
    description: `${location.name} at ${location.address}. Call ${location.phone} for repair, battery check, and EV support services.`
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const location = await getLegacyServiceLocationById(params.locationId);

  if (!location) {
    notFound();
  }

  return (
    <section className="container-shell py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
            {location.name}
          </h1>
          <p className="mt-3 text-gray-400">{location.address}</p>

          <div className="mt-6 grid gap-3">
            <article className="panel p-4">
              <h2 className="text-lg font-bold tracking-tight text-white">Phone</h2>
              <p className="mt-1 text-gray-400">{location.phone}</p>
            </article>
            <article className="panel p-4">
              <h2 className="text-lg font-bold tracking-tight text-white">Hours</h2>
              <p className="mt-1 text-gray-400">{location.hours}</p>
            </article>
            <article className="panel p-4">
              <h2 className="text-lg font-bold tracking-tight text-white">Services Offered</h2>
              <ul className="mt-2 list-inside list-disc text-gray-400">
                {location.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`tel:${location.phone}`}
              className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm font-bold text-gray-100 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
            >
              Call
            </a>
            <WhatsAppButton productName={`service booking at ${location.name}`} label="Book Service" />
            <a
              href={location.map_link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#00BFFF]/50 bg-[#00BFFF]/20 px-5 py-2 text-sm font-bold text-[#00BFFF] transition-all duration-300 ease-out hover:border-[#00BFFF] hover:bg-[#00BFFF]/30"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <iframe
            title={`Spiro service location map for ${location.name} in Nairobi`}
            src={location.map_link}
            width="100%"
            height="500"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import ServiceLocator from "@/components/sections/ServiceLocator";
import { getLegacyServiceLocations } from "@/lib/sanity/queries-data";

export const metadata: Metadata = {
  title: "Service Center",
  description:
    "Locate Spiro EV battery swapping and service centers in Nairobi and across Kenya with repair, diagnostics, and support services."
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SPIRO SPARES",
  telephone: "+254733959383",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Dunga Close, Near Car & General Roundabout, Industrial Area",
    addressLocality: "Nairobi",
    addressCountry: "KE"
  },
  openingHours: "Mo-Sa 08:00-18:00"
};

export default async function ServicesPage() {
  const serviceLocations = await getLegacyServiceLocations();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <HeroBanner
        title="Kenya Service and Swapping Locations"
        subtitle="Select any service point to instantly view its map, contact details, and battery-swapping availability."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Service Center" }]}
      />

      <ServiceLocator locations={serviceLocations} />
    </>
  );
}
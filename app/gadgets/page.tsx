// ISR: Revalidate every 60 seconds to pick up Sanity changes
export const revalidate = 60;

import { Suspense } from "react";
import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import GadgetsCatalog from "@/components/sections/GadgetsCatalog";
import { getLegacyGadgets } from "@/lib/sanity/queries-data";

export const metadata: Metadata = {
  title: "Gadgets",
  description:
    "Smart rider accessories including phone holders, chargers, safety gear, and security add-ons for Spiro riders in Kenya."
};

export default async function GadgetsPage() {
  const gadgets = await getLegacyGadgets();

  return (
    <>
      <HeroBanner
        title="Smart Accessories for Riders"
        subtitle="Explore practical rider tech from phone holders to anti-theft gadgets optimized for urban delivery operations."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gadgets" }]}
      />

      <Suspense fallback={<section className="container-shell py-10"><div className="panel p-6 text-center text-gray-400">Loading gadget catalog...</div></section>}>
        <GadgetsCatalog items={gadgets} />
      </Suspense>
    </>
  );
}
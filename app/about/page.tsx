import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about TamTech EV Solutions and our mission to support electric mobility growth in Kenya."
};

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        title="About SPIRO SPARES Network"
           subtitle="Building Kenya's most reliable ecosystem for mobility, spares availability, and rider continuity."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <section className="container-shell py-10">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <article className="panel p-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Our Mission</h2>
            <p className="mt-3 text-gray-400">
              SPIRO SPARES exists to eliminate rider downtime by combining reliable bikes, genuine components, and service infrastructure that riders can trust every day.
            </p>
            <p className="mt-3 text-gray-400">
              We serve individual riders, logistics fleets, and entrepreneurs with predictable maintenance workflows and consistent stock availability.
            </p>
          </article>

          <article className="panel p-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Why Choose TamTech</h2>
            <ul className="mt-4 space-y-2 text-gray-400">
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Verified genuine products and OEM-level quality control.</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">National service and battery swapping coverage for rider continuity.</li>
              <li className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">Technical guidance for fitment, diagnostics, and replacement cycles.</li>
            </ul>
          </article>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <article className="panel p-5">
            <p className="text-3xl font-extrabold text-white">10K+</p>
            <p className="mt-1 text-sm text-gray-400">Riders Supported</p>
          </article>
          <article className="panel p-5">
            <p className="text-3xl font-extrabold text-white">24/7</p>
            <p className="mt-1 text-sm text-gray-400">Support Readiness</p>
          </article>
          <article className="panel p-5">
            <p className="text-3xl font-extrabold text-white">10</p>
            <p className="mt-1 text-sm text-gray-400">Kenya Service Points</p>
          </article>
          <article className="panel p-5">
            <p className="text-3xl font-extrabold text-white">98%</p>
            <p className="mt-1 text-sm text-gray-400">Parts Availability SLA</p>
          </article>
        </div>

        <article className="panel mt-6 p-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">Infrastructure and Operations</h2>
          <p className="mt-3 text-gray-400">
            Our operations stack combines spare-part warehousing, field technician scheduling, and battery swapping touchpoints to keep rider trips uninterrupted.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold text-white">Warehouse Grid</h3>
              <p className="mt-1 text-sm text-gray-400">Fast-moving parts staged for same-day dispatch in key markets.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold text-white">Technical Hub</h3>
              <p className="mt-1 text-sm text-gray-400">Diagnostics and component testing for mission-critical fleet reliability.</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold text-white">Service Network</h3>
              <p className="mt-1 text-sm text-gray-400">Regional service points integrated with battery swapping and repair pipelines.</p>
            </div>
          </div>
        </article>
      </section>
    </>
  );
}
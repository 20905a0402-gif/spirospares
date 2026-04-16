import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";

export const metadata: Metadata = {
  title: "Tracking",
  description:
    "Track your order and understand each delivery stage from dispatch to doorstep using industry-standard shipment milestones."
};

const trackingStages = [
  {
    title: "Order Confirmed",
    detail: "Order is validated, payment is confirmed, and the warehouse receives a pick request."
  },
  {
    title: "Packed and Quality Checked",
    detail: "Items are packed, scanned, and tagged with a shipment reference before handover."
  },
  {
    title: "Dispatched",
    detail: "Shipment is handed to a rider or logistics partner and first-mile movement begins."
  },
  {
    title: "In Transit",
    detail: "Shipment moves through route checkpoints with periodic status refresh."
  },
  {
    title: "Out for Delivery",
    detail: "Rider is on the last-mile route with expected arrival window."
  },
  {
    title: "Delivered",
    detail: "Parcel is received and completion is logged with timestamp confirmation."
  }
];

export default function TrackingPage() {
  return (
    <>
      <HeroBanner
        title="Order Tracking"
        subtitle="Follow your shipment from warehouse to doorstep with clear milestone updates."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tracking" }]}
      />

      <section className="container-shell py-8">
        <div className="panel p-5 md:p-6">
          <h2 className="text-xl font-bold tracking-tight text-white md:text-2xl">Track by Order ID or Phone Number</h2>
          <p className="mt-2 text-sm text-gray-400">Use your reference from order confirmation SMS, WhatsApp, or checkout receipt.</p>

          <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
            <input
              type="text"
              placeholder="Order ID (example: SP-240614-1451)"
              className="rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-gray-500 focus:border-[#00BFFF]/70 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-gray-500 focus:border-[#00BFFF]/70 focus:outline-none"
            />
            <button
              type="button"
              className="rounded-xl bg-[#00BFFF] px-6 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110"
            >
              Check Status
            </button>
          </div>
        </div>
      </section>

      <section className="container-shell pb-10">
        <div className="panel p-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">How Tracking Works</h2>
          <p className="mt-2 text-sm text-gray-400">
            Based on common logistics standards, each shipment passes through visible checkpoints so riders and fleet teams can plan ahead.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trackingStages.map((stage, index) => (
              <article key={stage.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00BFFF]">Stage {index + 1}</p>
                <h3 className="mt-2 text-lg font-bold text-white">{stage.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{stage.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

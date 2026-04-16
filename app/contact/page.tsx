import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact TamTech EV Solutions for bike orders, spares, and service bookings in Nairobi and across Kenya."
};

export default function ContactPage() {
  return (
    <>
      <HeroBanner
        title="Contact SPIRO SPARES Team"
        subtitle="Talk to our specialists for bike procurement, spare fitment, service scheduling, and fleet support planning."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="container-shell py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <article className="panel p-6">
            <h2 className="text-2xl font-bold tracking-tight text-white">Send Us a Message</h2>
            <form className="mt-4 grid gap-3">
              <input
                type="text"
                placeholder="Name"
                className="rounded-xl border border-white/20 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00BFFF]/60 focus:outline-none"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="rounded-xl border border-white/20 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00BFFF]/60 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="rounded-xl border border-white/20 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00BFFF]/60 focus:outline-none"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={5}
                className="rounded-xl border border-white/20 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00BFFF]/60 focus:outline-none"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-[#00BFFF] px-5 py-3 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
              >
                Submit Inquiry
              </button>
            </form>
          </article>

          <div className="space-y-4">
            <article className="panel p-5">
              <h2 className="text-xl font-bold tracking-tight text-white">Contact Details</h2>
              <p className="mt-3 text-gray-400">Global Headquarters: Dunga Close, Near Car &amp; General Roundabout, Industrial Area, Nairobi</p>
              <p className="mt-2 text-gray-400">Phone: +254 733 959 383</p>
              <p className="mt-1 text-gray-400">Email: support@spirospares.co.ke</p>
            </article>

            <article className="panel overflow-hidden">
              <iframe
                title="SPIRO SPARES headquarters map"
                src="https://www.google.com/maps?q=Dunga+Close+Industrial+Area+Nairobi&output=embed"
                width="100%"
                height="340"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

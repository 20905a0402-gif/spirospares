"use client";

import { useMemo, useState } from "react";
import ServiceCard from "@/components/cards/ServiceCard";
import { ServiceLocation } from "@/lib/data";

type ServicesSearchProps = {
  locations: ServiceLocation[];
};

export default function ServicesSearch({ locations }: ServicesSearchProps) {
  const [query, setQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");

  const serviceTypes = useMemo(() => {
    const set = new Set<string>();
    locations.forEach((location) => {
      location.services.forEach((service) => set.add(service));
    });
    return ["All", ...Array.from(set)];
  }, [locations]);

  const filtered = useMemo(() => {
    const lowered = query.toLowerCase();

    return locations.filter((location) => {
      const matchQuery =
        location.name.toLowerCase().includes(lowered) ||
        location.address.toLowerCase().includes(lowered) ||
        location.services.join(" ").toLowerCase().includes(lowered);
      const matchService =
        serviceFilter === "All" || location.services.some((service) => service === serviceFilter);

      return matchQuery && matchService;
    });
  }, [locations, query, serviceFilter]);

  return (
    <section className="container-shell pb-14">
      <div className="glass-panel rounded-2xl p-5">
        <h2 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Find a Nearby Service Point
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_280px]">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by City, Area, Service type"
            className="rounded-xl border border-white/20 bg-[#121212] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00BFFF]/50 focus:outline-none"
          />

          <select
            value={serviceFilter}
            onChange={(event) => setServiceFilter(event.target.value)}
            className="rounded-xl border border-white/20 bg-[#121212] px-4 py-3 text-white focus:border-[#00BFFF]/50 focus:outline-none"
          >
            {serviceTypes.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {filtered.map((location) => (
          <ServiceCard key={location.id} location={location} />
        ))}
      </div>
    </section>
  );
}

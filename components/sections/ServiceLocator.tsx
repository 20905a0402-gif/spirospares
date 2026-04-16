"use client";

import { useMemo, useState } from "react";
import { ServiceLocation } from "@/lib/data";

type ServiceLocatorProps = {
  locations: ServiceLocation[];
};

export default function ServiceLocator({ locations }: ServiceLocatorProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? "");

  const filteredLocations = useMemo(() => {
    const lowered = query.toLowerCase().trim();

    if (!lowered) {
      return locations;
    }

    return locations.filter((location) => {
      const searchable = `${location.name} ${location.city} ${location.area} ${location.services.join(" ")}`.toLowerCase();
      return searchable.includes(lowered);
    });
  }, [locations, query]);

  const selectedLocation =
    filteredLocations.find((location) => location.id === selectedId) ?? filteredLocations[0] ?? locations[0];

  return (
    <section className="container-shell py-10">
      <div className="panel p-4 md:p-6">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by city, area, or service type"
          className="w-full rounded-xl border border-white/15 bg-[#0f0f0f] px-4 py-3 text-white placeholder:text-gray-500 focus:border-[#00BFFF]/60 focus:outline-none"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[420px_1fr]">
        <div className="max-h-[68vh] space-y-3 overflow-y-auto pr-1">
          <div className="sticky top-0 z-10 rounded-lg border border-green-500/40 bg-[#0f0f0f]/95 px-3 py-2 text-xs text-green-400 backdrop-blur">
            ⚡ indicates battery swapping available at the location.
          </div>

          {filteredLocations.map((location) => {
            const isActive = selectedLocation?.id === location.id;
            return (
              <button
                key={location.id}
                type="button"
                onClick={() => setSelectedId(location.id)}
                className={`panel w-full p-4 text-left transition-all duration-300 ease-out hover:border-[#00BFFF]/50 ${
                  isActive ? "border-[#00BFFF]/70" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-white">{location.name}</h2>
                    <p className="mt-1 text-sm text-gray-400">
                      {location.area}, {location.city}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">{location.address}</p>
                  </div>
                  {location.battery_swapping ? (
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-green-500 bg-green-500/20 text-sm font-bold text-green-400 shadow-[0_0_14px_rgba(34,197,94,0.35)]">
                      ⚡
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        <div className="panel h-[420px] overflow-hidden">
          {selectedLocation ? (
            <iframe
              key={selectedLocation.id}
              title={`Service map for ${selectedLocation.name}`}
              src={selectedLocation.map_link}
              className="block h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-[420px] items-center justify-center text-gray-500">No service locations found.</div>
          )}
        </div>
      </div>
    </section>
  );
}


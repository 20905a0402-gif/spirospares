import Link from "next/link";
import { ServiceLocation } from "@/lib/data";

type ServiceCardProps = {
  location: ServiceLocation;
};

export default function ServiceCard({ location }: ServiceCardProps) {
  return (
    <article className="panel p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#00BFFF]/50">
      <h3 className="text-xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
        {location.name}
      </h3>
      <p className="mt-3 text-sm text-gray-400">{location.address}</p>
      <p className="mt-1 text-sm text-gray-400">{location.phone}</p>
      <p className="mt-1 text-sm text-gray-400">{location.hours}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/services/${location.id}`}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all duration-300 ease-out hover:border-[#00BFFF]/60 hover:text-[#00BFFF]"
        >
          Details
        </Link>
        <a
          href={location.map_link}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-[#00BFFF]/50 bg-[#00BFFF]/20 px-4 py-2 text-sm font-bold text-[#00BFFF] transition-all duration-300 ease-out hover:border-[#00BFFF] hover:bg-[#00BFFF]/30"
        >
          Get Directions
        </a>
      </div>
    </article>
  );
}

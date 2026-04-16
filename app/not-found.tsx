import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-shell py-20">
      <div className="panel p-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white" style={{ fontFamily: "var(--font-heading)" }}>
          Page not found
        </h1>
        <p className="mt-2 text-gray-400">The requested page does not exist or may have moved.</p>
        <Link
          href="/"
          className="mt-5 inline-flex rounded-full bg-[#00BFFF] px-5 py-2 text-sm font-bold text-white transition-all duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_15px_rgba(0, 191, 255,0.4)]"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

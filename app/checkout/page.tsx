import { Suspense } from "react";
import HeroBanner from "@/components/HeroBanner";
import CheckoutPanel from "@/components/sections/CheckoutPanel";

export default function CheckoutPage() {
  return (
    <>
      <HeroBanner
        title="Secure Checkout"
        subtitle="Review your selected item and confirm your booking instantly."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Checkout" }]}
      />

      <section className="container-shell py-10">
        <Suspense fallback={<div className="panel mx-auto max-w-3xl p-8 text-center text-gray-400">Loading checkout...</div>}>
          <CheckoutPanel />
        </Suspense>
      </section>
    </>
  );
}

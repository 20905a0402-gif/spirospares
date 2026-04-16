import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import CartPanel from "@/components/sections/CartPanel";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review and manage your selected SPIRO SPARES items before checkout."
};

export default function CartPage() {
  return (
    <>
      <HeroBanner
        title="Your Cart"
        subtitle="Review selected bikes, spares, and smart accessories before proceeding to checkout."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cart" }]}
      />

      <section className="container-shell py-10">
        <CartPanel />
      </section>
    </>
  );
}

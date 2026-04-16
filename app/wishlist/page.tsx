import { Metadata } from "next";
import HeroBanner from "@/components/HeroBanner";
import WishlistPanel from "@/components/sections/WishlistPanel";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Manage and revisit your saved SPIRO SPARES products and accessories."
};

export default function WishlistPage() {
  return (
    <>
      <HeroBanner
        title="Saved Wishlist"
        subtitle="Keep track of every bike, spare, and gadget you plan to purchase next."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />

      <section className="container-shell py-10">
        <WishlistPanel />
      </section>
    </>
  );
}

import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "General terms governing use of the Spiro Spares storefront and services."
};

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="By using this storefront, you agree to the terms below regarding purchases, conduct, and platform use."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "Accountability and Use",
          paragraphs: [
            "Customers are responsible for providing complete and accurate information when placing orders.",
            "You agree not to misuse the platform for fraud, abuse, or unlawful transactions.",
            "We may suspend suspicious activity to protect customer accounts and service integrity."
          ]
        },
        {
          title: "Pricing and Availability",
          paragraphs: [
            "Product availability and pricing may change without prior notice based on stock and supply conditions.",
            "Order confirmation is subject to stock validation and payment verification where applicable.",
            "If an item is unavailable after order placement, our team will provide replacement or refund options."
          ]
        },
        {
          title: "Liability and Dispute Handling",
          paragraphs: [
            "Spiro Spares is not liable for indirect losses resulting from delayed shipments outside reasonable control.",
            "Any disputes should be submitted to support first for amicable resolution and documented review.",
            "These terms are governed by applicable laws of Kenya unless superseded by mandatory legal requirements."
          ]
        }
      ]}
    />
  );
}

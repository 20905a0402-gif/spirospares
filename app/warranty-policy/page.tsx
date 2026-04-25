import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Warranty Policy",
  description: "Warranty terms and claim process for Spiro Spares products."
};

export default function WarrantyPolicyPage() {
  return (
    <PolicyPage
      title="Warranty Policy"
      intro="Warranty coverage varies by category and applies to manufacturer defects under normal use conditions."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "Coverage Scope",
          paragraphs: [
            "Warranty applies to qualifying defects in materials or workmanship identified during the coverage period.",
            "Coverage duration depends on product category, supplier terms, and documented invoice date.",
            "Claim approvals may require product inspection by a qualified Spiro Spares technician."
          ]
        },
        {
          title: "What Is Not Covered",
          paragraphs: [
            "Normal wear and tear, accidental damage, misuse, unauthorized modification, and water ingress are excluded.",
            "Installation by unauthorized service providers may void warranty where fitment standards are not followed.",
            "Consumables and cosmetic wear are generally excluded unless explicitly stated in product documentation."
          ]
        },
        {
          title: "Claim Process",
          paragraphs: [
            "Submit your claim with order details, issue description, and supporting images or videos where applicable.",
            "If approved, the remedy may include repair, replacement, or partial credit based on inspection findings.",
            "Turnaround time depends on diagnosis complexity, parts availability, and supplier approval cycles."
          ]
        }
      ]}
    />
  );
}

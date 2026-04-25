import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Return and replacement guidelines for Spiro Spares orders."
};

export default function ReturnPolicyPage() {
  return (
    <PolicyPage
      title="Return Policy"
      intro="This policy defines return eligibility, timelines, and conditions for exchanges or refunds."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "Return Window",
          paragraphs: [
            "Eligible products can be requested for return within 7 calendar days from delivery date.",
            "Damaged-on-arrival or incorrect-item reports should be submitted within 48 hours for fastest resolution.",
            "Return approval depends on condition verification and compatibility checks."
          ]
        },
        {
          title: "Eligibility Conditions",
          paragraphs: [
            "Products must be unused, in original packaging, and include all manuals, accessories, and labels.",
            "Installed electrical parts, consumables, and products with signs of misuse are not return-eligible.",
            "Compatibility-related returns are reviewed against the bike model information shared at purchase."
          ]
        },
        {
          title: "Refund and Exchange Handling",
          paragraphs: [
            "Approved refunds are processed to the original payment method or approved transfer channel.",
            "Exchange requests are fulfilled subject to stock availability of the requested replacement item.",
            "Processing timelines may vary by payment provider and verification requirements."
          ]
        }
      ]}
    />
  );
}

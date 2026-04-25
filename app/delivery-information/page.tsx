import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Delivery Information",
  description: "Delivery timelines and service levels for Spiro Spares in Kenya."
};

export default function DeliveryInformationPage() {
  return (
    <PolicyPage
      title="Delivery Information"
      intro="Use this page to understand expected delivery windows, service levels, and proof-of-delivery standards."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "Estimated Delivery Windows",
          paragraphs: [
            "Nairobi standard delivery: typically 0 to 2 business days after dispatch.",
            "Major towns outside Nairobi: typically 1 to 4 business days after dispatch.",
            "Rural and remote destinations: typically 3 to 7 business days depending on partner routes."
          ]
        },
        {
          title: "Service Levels",
          paragraphs: [
            "Standard delivery is available for all order types and follows regular route schedules.",
            "Express delivery is available on selected routes and may include a surcharge shown at checkout.",
            "Pickup option is available through listed pickup points when selected during checkout."
          ]
        },
        {
          title: "Delivery Completion",
          paragraphs: [
            "A delivery is considered complete when the package is handed over to the named recipient or authorized contact.",
            "For high-value items, our team may request ID confirmation, OTP confirmation, or signature on handover.",
            "If package condition appears compromised on arrival, report it immediately before using the product."
          ]
        }
      ]}
    />
  );
}

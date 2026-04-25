import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Spiro Spares collects, uses, and protects customer information."
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="We respect your privacy and process personal data only for clear operational, legal, and service purposes."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "Data We Collect",
          paragraphs: [
            "We may collect name, phone number, email, delivery address, and order details during browsing or checkout.",
            "We may collect service interactions such as support requests, restock notifications, and policy acknowledgments.",
            "Technical information such as device type and session behavior may be collected for performance and security."
          ]
        },
        {
          title: "How We Use Data",
          paragraphs: [
            "Data is used to process orders, coordinate delivery, provide support, and improve storefront reliability.",
            "We use contact details for order updates, support follow-up, and essential service communication.",
            "We do not sell personal information to third-party advertisers."
          ]
        },
        {
          title: "Data Protection and Retention",
          paragraphs: [
            "We apply access controls and platform-level safeguards to protect stored information.",
            "Data is retained only as long as needed for operations, legal requirements, or dispute resolution.",
            "You may request corrections or deletion of eligible personal data by contacting support."
          ]
        }
      ]}
    />
  );
}

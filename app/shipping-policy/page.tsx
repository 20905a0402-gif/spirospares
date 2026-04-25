import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping policy for Spiro Spares orders across Kenya."
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="This policy explains dispatch windows, carrier handling, and shipping conditions for all Spiro Spares purchases."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "Dispatch Timeline",
          paragraphs: [
            "Orders confirmed before 2:00 PM are prioritized for same-day dispatch in Nairobi where stock is available.",
            "Orders confirmed after cut-off, on Sundays, or on public holidays are dispatched on the next business day.",
            "Dispatch confirmation is shared through your provided phone number or email."
          ]
        },
        {
          title: "Coverage and Carriers",
          paragraphs: [
            "We ship across Kenya using vetted logistics partners and rider networks based on your destination.",
            "Remote delivery zones may require additional handling time depending on route availability and security checks.",
            "Carrier assignment may vary by product type, parcel size, and service level selected at checkout."
          ]
        },
        {
          title: "Address and Contact Accuracy",
          paragraphs: [
            "Customers are responsible for providing accurate delivery details including phone number and landmark notes.",
            "If incorrect details delay delivery, Spiro Spares may contact you for revalidation before continuing shipment.",
            "Additional reattempt fees may apply where multiple delivery attempts fail due to inaccurate details."
          ]
        }
      ]}
    />
  );
}

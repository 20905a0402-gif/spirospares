import { Metadata } from "next";
import PolicyPage from "@/components/policies/PolicyPage";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Cookie usage and consent guidance for Spiro Spares storefront users."
};

export default function CookiePolicyPage() {
  return (
    <PolicyPage
      title="Cookie Policy"
      intro="Cookies help us keep the storefront stable, secure, and relevant to your browsing preferences."
      lastUpdated="18 April 2026"
      sections={[
        {
          title: "What Cookies We Use",
          paragraphs: [
            "Essential cookies are used for core features such as cart state, session continuity, and security checks.",
            "Preference cookies may store display and interaction settings to improve repeat visits.",
            "Analytics cookies may be used in aggregate form to understand page performance and user journeys."
          ]
        },
        {
          title: "How Cookies Help",
          paragraphs: [
            "Cookies reduce repeated input steps and improve checkout flow reliability.",
            "They help us identify technical issues and improve page speed and usability.",
            "They support fraud prevention and safe session behavior across devices."
          ]
        },
        {
          title: "Managing Cookie Preferences",
          paragraphs: [
            "You can control or delete cookies through your browser settings at any time.",
            "Blocking essential cookies may impact site functionality, including cart and checkout interactions.",
            "Continuing to use the site after policy updates indicates acceptance of revised cookie terms."
          ]
        }
      ]}
    />
  );
}

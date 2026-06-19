import InfoPageLayout from "../components/InfoPageLayout.jsx";

export default function TermsOfUsePage() {
  return (
    <InfoPageLayout
      eyebrow="Policy"
      title="Terms of Use"
      summary="These terms cover how MotorMandi’s marketplace pages, filters, listings, maps, and contact actions should be used. The site is built to help users discover and compare automotive products, not to replace seller verification or professional inspection."
      highlights={[
        "Use listings responsibly",
        "Verify details before buying",
        "Respect platform content",
        "Follow contact and map rules",
      ]}
      sections={[
        {
          title: "User responsibilities",
          points: [
            "Review listing details carefully before contacting a seller or making a purchase decision.",
            "Use the site for legitimate browsing, inquiry, and marketplace activity only.",
            "Do not copy, scrape, or misuse site content, listings, or media without permission.",
            "Use map and contact features respectfully and only for their intended purpose.",
          ],
        },
        {
          title: "Marketplace limitations",
          body:
            "MotorMandi provides discovery, comparison, and contact tools. It does not guarantee availability, condition, or compatibility of any product, and it does not replace checking the item directly with the seller or service provider.",
        },
        {
          title: "Acceptable use",
          body:
            "You may browse categories, search listings, open detail pages, and use nearby shop tools as intended. We may restrict access to users who misuse the platform, disrupt the service, or attempt to bypass normal site behavior.",
        },
      ]}
      cta={{
        title: "Continue browsing",
        description: "Return to the marketplace or review the privacy policy for data handling details.",
        primary: { label: "Go Home", to: "/" },
        secondary: { label: "Privacy Policy", to: "/privacy-policy" },
      }}
    />
  );
}
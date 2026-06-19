import InfoPageLayout from "../components/InfoPageLayout.jsx";

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout
      eyebrow="Policy"
      title="Privacy Policy"
      summary="MotorMandi collects only the information needed to run the marketplace experience, support search and listing features, and help users contact sellers or nearby shops. This page explains how those details are used within the app."
      highlights={[
        "Search and browsing data",
        "Contact details for inquiries",
        "Location for nearby shops",
        "Marketplace feature support",
      ]}
      sections={[
        {
          title: "Information we use",
          points: [
            "Search terms and filters so the site can show relevant listings and improve discovery.",
            "Contact details when a user calls, emails, or submits an inquiry through marketplace features.",
            "Location data when a user chooses nearby shop discovery or map features.",
            "Device and usage signals that help the website load, troubleshoot, and measure feature performance.",
          ],
        },
        {
          title: "How it is used",
          body:
            "The data is used to provide listings, search results, map views, and support flows. It also helps us improve categories, detail pages, and the overall browsing experience. We do not need your personal information to view public listings, but some features like location-based shops or contact actions may require it.",
        },
        {
          title: "Your choices",
          body:
            "You can browse most of the site without signing in. If a feature asks for location access, you can decline it and continue using the rest of the marketplace. If you contact us directly, your message is used only to respond to that request.",
        },
      ]}
      cta={{
        title: "Need help with a privacy question?",
        description: "Reach out through the contact options in the footer if you want clarification about how a feature works.",
        primary: { label: "Contact Us", to: "/#footer" },
        secondary: { label: "Terms of Use", to: "/terms-of-use" },
      }}
    />
  );
}
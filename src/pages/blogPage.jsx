import InfoPageLayout from "../components/InfoPageLayout.jsx";

const posts = [
  "How to use MotorMandi search to compare tyres, rims, and accessories quickly.",
  "What to check before opening a car or bike listing: price, condition, location, and seller details.",
  "Why nearby repair shops matter when you need fitting, installation, or urgent service.",
  "Best practices for posting and browsing automotive listings with less back-and-forth.",
];

export default function BlogPage() {
  return (
    <InfoPageLayout
      eyebrow="Updates"
      title="MotorMandi Blog"
      summary="This blog area highlights platform tips, product discovery advice, and marketplace updates. It is meant to help visitors get more value from search, filters, listings, and nearby-shop tools across the site."
      highlights={[
        "Marketplace tips",
        "Listing guidance",
        "Search and filter advice",
        "Nearby shop usage",
      ]}
      sections={[
        {
          title: "Recent posts",
          points: posts,
        },
        {
          title: "What we publish here",
          body:
            "Expect short, practical posts about how to search better, compare listings, understand categories, and use support features. The content is focused on real marketplace behavior rather than generic company news.",
        },
      ]}
      cta={{
        title: "Read from the marketplace",
        description: "Browse the main listings if you want to explore the products discussed in the blog.",
        primary: { label: "Featured Listings", to: "/" },
        secondary: { label: "About Us", to: "/about" },
      }}
    />
  );
}
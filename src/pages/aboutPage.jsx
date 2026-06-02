import InfoPageLayout from "../components/InfoPageLayout.jsx";

export default function AboutPage() {
  return (
    <InfoPageLayout
      eyebrow="Company"
      title="About MotorMandi"
      summary="MotorMandi is built to make automotive buying and selling simpler, faster, and more transparent. The platform brings tyres, wheels, rims, cars, bikes, accessories, and spare parts into one searchable marketplace with category filters, detail pages, and nearby shop discovery."
      highlights={[
        "Search by category or keyword",
        "Browse tyres, wheels, rims, cars, bikes, and accessories",
        "View nearby repair shops on the map",
        "Open dedicated detail pages for each listing type",
      ]}
      sections={[
        {
          title: "What the platform does",
          body:
            "MotorMandi helps users discover product listings, compare prices, and move from browsing to contact actions faster. The home page surfaces featured listings, category cards, and search entry points so visitors can jump straight to the products they want.",
        },
        {
          title: "How users interact",
          points: [
            "Use the home search bar to look for tyres, rims, cars, bikes, or accessories.",
            "Open category list pages to filter by type, brand, model, condition, and price.",
            "Use detail pages to review listing information and decide whether to contact the seller.",
            "Find nearby repair shops when you need service, fitting, or installation support.",
          ],
        },
      ]}
      cta={{
        title: "Start exploring the marketplace",
        description: "Go back to listings or jump into tyres, the most active product area on the site.",
        primary: { label: "Browse Tyres", to: "/tyres" },
        secondary: { label: "Home", to: "/" },
      }}
    />
  );
}
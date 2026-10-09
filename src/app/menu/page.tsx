import PageHeader from "@/components/PageHeader";
import MenuSection from "@/components/MenuSection";
import { businessConfig } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "/menu",
  // PART0: 0.5 "Latin American Grill" follows the site's current wording.
  "Latin American Grill Menu, Franklin Square NY",
  `Full menu with prices: tapas, picada, fajitas, asados, tacos, burritos, arepas and tres leches. 885 Hempstead Tpke, Franklin Square. Call ${businessConfig.phone}.`
);

export default function MenuPage() {
  return (
    <>
      <PageHeader
        kicker="The Table"
        title="Menu"
        description="From tapas built for sharing to asados carved tableside, a full menu of Latin classics, made to be passed around."
      />
      <MenuSection />
    </>
  );
}

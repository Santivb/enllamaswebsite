import Hero from "@/components/Hero";
import StorySection from "@/components/StorySection";
import OnsiteFoodSection from "@/components/OnsiteFoodSection";
import GallerySection from "@/components/GallerySection";
import VisitSection from "@/components/VisitSection";
import { businessConfig } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "",
  // PART0: 0.1 name and 0.5 cuisine, both from businessConfig.
  `${businessConfig.name} | ${businessConfig.cuisine} in Franklin Square, NY`,
  // PART0: 0.5 "Latin American grill" follows the site's current wording.
  `Open-flame Latin American grill at 885 Hempstead Tpke, Franklin Square, NY. Parrillada, tacos, fajitas, arepas and cocktails. Call ${businessConfig.phone} for pickup.`,
  {},
  true
);

export default function Home() {
  return (
    <>
      <Hero />
      <StorySection />
      <OnsiteFoodSection />
      <GallerySection />
      <VisitSection />
    </>
  );
}

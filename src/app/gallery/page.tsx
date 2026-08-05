import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import { getSocialUrl } from "@/lib/services/social";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Real dishes off the grill at En Llamas 87.",
};

const KITCHEN_PHOTOS = [
  { src: "/assets/food/gallery/chicken-fajita.jpg", alt: "Grilled chicken fajita with rice, beans and pico de gallo", width: 1200, height: 801 },
  { src: "/assets/food/gallery/carne-asada.jpg", alt: "Grilled carne asada with green salsa and pico de gallo", width: 1200, height: 1799 },
  { src: "/assets/food/gallery/loaded-tacos.jpg", alt: "Loaded taco and shrimp taco with salsa, guacamole and corn", width: 1200, height: 801 },
  { src: "/assets/food/gallery/salsa-trio.jpg", alt: "Fresh guacamole, pico de gallo and mango salsa", width: 1200, height: 801 },
  { src: "/assets/food/gallery/burrito.jpg", alt: "Burrito halves with queso dip and shredded cheese", width: 1200, height: 1800 },
  { src: "/assets/food/gallery/quesadilla.jpg", alt: "Cheese quesadilla with sour cream and avocado", width: 1200, height: 801 },
  { src: "/assets/food/gallery/maduros.jpg", alt: "Sweet plantains (maduros) drizzled with crema", width: 1200, height: 801 },
  { src: "/assets/food/gallery/taco-salad.jpg", alt: "Taco salad bowl with guacamole, corn and black beans", width: 1200, height: 801 },
  { src: "/assets/food/gallery/sides.jpg", alt: "Rice, beans and sides in white bowls", width: 1200, height: 800 },
  { src: "/assets/food/gallery/steak-shrimp-combo.jpg", alt: "Steak and shrimp in a savory house sauce", width: 1200, height: 1799 },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        kicker="Follow the Fire"
        title="Gallery"
        description="A look at life around the grill — real plates, straight off the flame. Our social feeds are just getting started."
      />

      {/* From the Kitchen */}
      <section className="relative bg-ink pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="section-heading text-xl md:text-2xl">From the Kitchen</h2>
          <div className="mt-8 columns-2 gap-4 sm:columns-3 md:columns-4">
            {KITCHEN_PHOTOS.map((photo) => (
              <div
                key={photo.src}
                className="mb-4 break-inside-avoid overflow-hidden rounded-sm border border-line"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="h-auto w-full"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facebook */}
      <section className="relative bg-ink pb-28">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <div className="rounded-sm border border-line bg-charcoal/50 p-10 text-center">
            <h2 className="font-display text-2xl text-cream">
              Events &amp; Announcements
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-parchment">
              Community updates, specials, and events will be shared on our
              Facebook page as they happen.
            </p>
            <a
              href={getSocialUrl("facebook")}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-gold/40 px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
            >
              Follow on Facebook
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

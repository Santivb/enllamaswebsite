import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/PageHeader";
import GalleryVideo from "@/components/GalleryVideo";
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
  { src: "/assets/food/gallery/steak-shrimp-cobb-salad.jpg", alt: "Steak and shrimp salad bowl with pico de gallo and cucumber", width: 768, height: 1024 },
  { src: "/assets/food/gallery/carne-asada-bowl.jpg", alt: "Carne asada bowl with rice, cheese and pico de gallo", width: 768, height: 1024 },
  { src: "/assets/food/gallery/chicken-quesadillas-tray.jpg", alt: "Tray of grilled chicken quesadillas", width: 1024, height: 768 },
  { src: "/assets/food/gallery/empanadas-guacamole.jpg", alt: "Fried empanadas served with guacamole", width: 768, height: 1024 },
  { src: "/assets/food/gallery/empanadas-plate.jpg", alt: "Empanadas with house salsas", width: 473, height: 450 },
  { src: "/assets/food/gallery/desayuno-tipico.jpg", alt: "Traditional Latin breakfast plate with eggs, plantains, avocado and rice", width: 678, height: 452 },
  { src: "/assets/food/gallery/shrimp-tostada-bowl.jpg", alt: "Crispy tostada bowl topped with chorizo, guacamole and pico de gallo", width: 1200, height: 1600 },
  { src: "/assets/food/gallery/chicken-enchiladas-plate.jpg", alt: "Chicken enchiladas plate with rice, beans and salsa verde", width: 768, height: 1024 },
  { src: "/assets/food/gallery/queso-fundido-stack.jpg", alt: "Stack of melted-cheese quesadillas on a clay plate", width: 1024, height: 680 },
  { src: "/assets/food/gallery/chorizo-tacos-plate.jpg", alt: "Chorizo tacos topped with guacamole and pico de gallo", width: 768, height: 1024 },
  { src: "/assets/food/gallery/catering-tray-parrillada.jpg", alt: "Catering tray of grilled parrillada with plantains and potatoes", width: 576, height: 1024 },
  { src: "/assets/food/gallery/steak-quesadillas-plate.jpg", alt: "Grilled steak quesadillas with pico de gallo, sour cream and salsa", width: 768, height: 1024 },
  { src: "/assets/food/gallery/carne-tacos-guacamole.jpg", alt: "Carne asada street tacos topped with guacamole", width: 768, height: 1024 },
  { src: "/assets/food/gallery/grilled-chicken-rice-plate.jpg", alt: "Grilled chicken plate with rice, roasted potatoes and salad", width: 768, height: 1024 },
  { src: "/assets/food/gallery/burrito-on-grill.jpg", alt: "Burrito grilling with char marks", width: 768, height: 1024 },
  { src: "/assets/food/gallery/family-style-spread.jpg", alt: "Family-style table spread of parrillada, rice, salad and empanadas", width: 768, height: 1024 },
  { src: "/assets/food/gallery/margaritas-chips.jpg", alt: "Margaritas and tortilla chips with salsa at the table", width: 768, height: 1024 },
  { src: "/assets/food/gallery/guest-parrillada-toast.jpg", alt: "A guest enjoying a parrillada platter and a cold beer", width: 768, height: 1024 },
];

const KITCHEN_VIDEOS = [
  {
    src: "/assets/video/catering-tacos-pico.mp4",
    poster: "/assets/video/catering-tacos-pico.jpg",
    width: 1024,
    height: 576,
    label: "Fresh tacos, tray-ready",
  },
  {
    src: "/assets/video/catering-saucy-wings.mp4",
    poster: "/assets/video/catering-saucy-wings.jpg",
    width: 1024,
    height: 576,
    label: "Off the grill",
  },
  {
    src: "/assets/video/catering-shrimp-tacos.mp4",
    poster: "/assets/video/catering-shrimp-tacos.jpg",
    width: 576,
    height: 1024,
    label: "Shrimp tacos, plated for pickup",
  },
  {
    src: "/assets/video/catering-yellow-rice.mp4",
    poster: "/assets/video/catering-yellow-rice.jpg",
    width: 576,
    height: 1024,
    label: "A full tray, ready to go",
  },
  {
    src: "/assets/video/catering-flame-grill.mp4",
    poster: "/assets/video/catering-flame-grill.jpg",
    width: 1024,
    height: 576,
    label: "Straight off the open flame",
  },
  {
    src: "/assets/video/catering-parrillada-tray.mp4",
    poster: "/assets/video/catering-parrillada-tray.jpg",
    width: 1024,
    height: 576,
    label: "Parrillada tray, fresh off the grill",
  },
  {
    src: "/assets/video/catering-cheese-griddle.mp4",
    poster: "/assets/video/catering-cheese-griddle.jpg",
    width: 1024,
    height: 576,
    label: "Cheese quesadilla on the griddle",
  },
  {
    src: "/assets/video/catering-empanadas-frying.mp4",
    poster: "/assets/video/catering-empanadas-frying.jpg",
    width: 1024,
    height: 576,
    label: "Empanadas frying to order",
  },
  {
    src: "/assets/video/catering-empanadas-plate.mp4",
    poster: "/assets/video/catering-empanadas-plate.jpg",
    width: 1024,
    height: 576,
    label: "Empanadas plated with guacamole",
  },
  {
    src: "/assets/video/catering-steak-plantains.mp4",
    poster: "/assets/video/catering-steak-plantains.jpg",
    width: 1024,
    height: 576,
    label: "Steak and plantains, tray-ready",
  },
  {
    src: "/assets/video/catering-fajita-toss.mp4",
    poster: "/assets/video/catering-fajita-toss.jpg",
    width: 576,
    height: 1032,
    label: "Chicken fajita, tossed and sizzling",
  },
  {
    src: "/assets/video/catering-chicken-plate.mp4",
    poster: "/assets/video/catering-chicken-plate.jpg",
    width: 576,
    height: 1024,
    label: "Grilled chicken plate, ready to serve",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        kicker="Follow the Fire"
        title="Gallery"
        description="A look at life around the grill: real plates, fresh from the kitchen. Our social feeds are just getting started."
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

      {/* Catering in motion */}
      <section className="relative bg-ink pb-24">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <h2 className="section-heading text-xl md:text-2xl">Catering in Motion</h2>
          <div className="mt-8 columns-2 gap-4 md:columns-4">
            {KITCHEN_VIDEOS.map((video) => (
              <GalleryVideo key={video.src} {...video} />
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

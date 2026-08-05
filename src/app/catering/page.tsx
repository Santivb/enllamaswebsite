import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import CateringForm from "@/components/CateringForm";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Full-flame catering from En Llamas 87 — parrillada and picada platters for your next gathering in Franklin Square, NY.",
};

export default function CateringPage() {
  return (
    <>
      <PageHeader
        kicker="Special Orders & Custom Events"
        title="Catering"
        description="From office lunches to backyard celebrations, our grill travels. Share a few details about your special order and our team will follow up with a custom quote."
      />

      <section className="relative bg-ink pb-16 md:pb-20">
        <div className="mx-auto max-w-4xl px-6 md:px-10">
          <div className="relative overflow-hidden rounded-sm border border-line">
            <Image
              src="/assets/food/parrillada.jpg"
              alt="Parrillada platter from En Llamas 87 — mixed grilled meats, sausages, grilled vegetables, salsas, and warm tortillas"
              width={1800}
              height={1285}
              className="h-auto w-full object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
          <p className="mt-4 text-center font-script text-lg italic text-gold-bright md:text-xl">
            Our parrillada — built for the table, sized for a crowd.
          </p>
        </div>
      </section>

      <section className="relative bg-ink pb-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <CateringForm />
        </div>
      </section>

      <section className="relative bg-ink pb-28">
        <div className="mx-auto max-w-2xl px-6 md:px-10">
          <div className="rounded-sm border border-gold/25 bg-charcoal/50 p-8 text-center">
            <h2 className="font-display text-xl text-cream md:text-2xl">
              Just Need a Bigger Order?
            </h2>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-parchment">
              For more of what&rsquo;s already on the menu, without the full
              catering setup — think a stack of tacos or a few trays of
              parrillada — request a bulk order instead. A week or more
              notice is preferred.
            </p>
            <Link
              href="/bulk-orders"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-gold/40 px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
            >
              Request a Bulk Order
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

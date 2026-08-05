import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AlcoholPolicyNotice from "@/components/AlcoholPolicyNotice";
import DeliveryAppButton from "@/components/DeliveryAppButton";
import DeliveryZones from "@/components/DeliveryZones";
import HoursList from "@/components/HoursList";
import { businessConfig } from "@/config/business";

export const metadata: Metadata = {
  title: "Order Online",
  description:
    "Pickup, delivery, and catering from En Llamas 87 — a modern Latin American grill in Franklin Square, NY.",
};

export default function OrderPage() {
  return (
    <>
      <PageHeader
        kicker="Bring the Fire Home"
        title="Order Online"
        description="However you're gathering, En Llamas 87 travels well. Pickup, delivery, and full catering — all built around the same open-flame menu you'd get in the dining room."
      />

      <section className="relative bg-ink pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3 md:px-10">
          {/* Pickup */}
          <div className="flex flex-col rounded-sm border border-line bg-charcoal/50 p-8">
            <h2 className="font-display text-2xl text-cream">Pickup</h2>
            <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-parchment">
              Order ahead and skip the wait — your food will be ready and
              fresh off the grill when you arrive.
            </p>
            <div className="mt-6 rounded-sm border border-gold/20 bg-ink/40 px-4 py-3 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold-bright">
                Coming Soon
              </p>
              <p className="mt-1 font-sans text-xs text-parchment/70">
                Online pickup ordering is on its way — call{" "}
                <a href={businessConfig.phoneHref} className="text-gold-bright hover:underline">
                  {businessConfig.phone}
                </a>{" "}
                or{" "}
                <a
                  href={businessConfig.phoneSecondaryHref}
                  className="text-gold-bright hover:underline"
                >
                  {businessConfig.phoneSecondary}
                </a>{" "}
                to order ahead in the meantime.
              </p>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex flex-col rounded-sm border border-line bg-charcoal/50 p-8">
            <h2 className="font-display text-2xl text-cream">Delivery</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-parchment">
              {businessConfig.deliveryPolicyNote}
            </p>
            <div className="mt-6 space-y-2">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-gold">
                Delivery Zones
              </h3>
              <DeliveryZones />
            </div>
            <div className="mt-6 space-y-2">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-gold">
                Delivery Hours
              </h3>
              <HoursList variant="delivery" />
            </div>
            <div className="mt-6 flex-1 space-y-3">
              <DeliveryAppButton app="doordash" />
              <DeliveryAppButton app="ubereats" />
            </div>
          </div>

          {/* Catering */}
          <div className="flex flex-col rounded-sm border border-line bg-charcoal/50 p-8">
            <h2 className="font-display text-2xl text-cream">Catering</h2>
            <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-parchment">
              Feeding a crowd? Our parrillada and picada platters were made
              for the table — and for the office party, the backyard
              gathering, or the milestone celebration.
            </p>
            <Link
              href="/catering"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-bright"
            >
              Start a Catering Request
            </Link>
          </div>
        </div>
      </section>

      <section className="relative bg-ink pb-28">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <AlcoholPolicyNotice />
        </div>
      </section>
    </>
  );
}

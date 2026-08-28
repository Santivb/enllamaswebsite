import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AlcoholPolicyNotice from "@/components/AlcoholPolicyNotice";
import DeliveryAppButton from "@/components/DeliveryAppButton";
import DeliveryZones from "@/components/DeliveryZones";
import HoursList from "@/components/HoursList";
import OrderBuilder from "@/components/OrderBuilder";
import { businessConfig } from "@/config/business";

/**
 * Online ordering was paused 2026-08-27 at the client's request
 * (businessConfig.onlineOrderingEnabled). While it is off, this route stays
 * live and indexable on purpose — existing links, printed material and search
 * results all point here, and a 404 would turn a temporary pause into a dead
 * end. It renders a call-us notice instead of the order builder.
 */
const orderingPaused = !businessConfig.onlineOrderingEnabled;

export const metadata: Metadata = {
  title: "Order Online",
  description: orderingPaused
    ? "Online ordering from En Llamas 87 is temporarily unavailable. Call us to place a pickup order, or send a catering request."
    : "Pickup, delivery, and catering from En Llamas 87, a modern Latin American grill in Franklin Square, NY.",
};

/** The one CTA that still works while ordering is paused: the phone. */
function CallToOrderPanel() {
  return (
    <div className="rounded-sm border border-gold/30 bg-charcoal/50 p-8 md:p-12">
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold">
        Temporarily Unavailable
      </p>
      <h2 className="mt-4 font-display text-3xl text-cream md:text-4xl">
        Online ordering is paused right now
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-parchment md:text-base">
        We&rsquo;ve turned off online orders for the moment, so nothing can be
        placed or paid for through the website. The kitchen is still on the
        grill and we&rsquo;re still taking orders &mdash; just give us a call
        and we&rsquo;ll take it down for you.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={businessConfig.phoneHref}
          className="inline-flex items-center justify-center rounded-full bg-gold px-8 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-bright"
        >
          Call {businessConfig.phone}
        </a>
        <a
          href={businessConfig.phoneSecondaryHref}
          className="inline-flex items-center justify-center rounded-full border border-cream/30 px-8 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-cream transition-colors hover:border-cream"
        >
          Call {businessConfig.phoneSecondary}
        </a>
      </div>

      <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-gold">
            When to Call
          </h3>
          <HoursList />
        </div>
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-[0.2em] text-gold">
            Feeding a Crowd?
          </h3>
          <p className="font-sans text-sm leading-relaxed text-parchment">
            Catering and large bulk orders are unaffected &mdash; those run
            through a request form, not online checkout.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            <Link
              href="/catering"
              className="font-sans text-sm text-gold-bright hover:underline"
            >
              Start a catering request
            </Link>
            <Link
              href="/bulk-orders"
              className="font-sans text-sm text-gold-bright hover:underline"
            >
              Bulk orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  if (orderingPaused) {
    return (
      <>
        <PageHeader
          kicker="Bring the Fire Home"
          title="Order Online"
          description="Online ordering is paused for now. We're still open, and we'll happily take your order over the phone."
        />

        <section className="relative bg-ink pb-24">
          <div className="mx-auto max-w-4xl px-6 md:px-10">
            <CallToOrderPanel />
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

  return (
    <>
      <PageHeader
        kicker="Bring the Fire Home"
        title="Order Online"
        description="However you're gathering, En Llamas 87 travels well. Pickup, delivery, and full catering, all built around the same open-flame menu you'd get in the dining room."
      />

      <section className="relative bg-ink pb-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3 md:px-10">
          {/* Pickup */}
          <div className="flex flex-col rounded-sm border border-line bg-charcoal/50 p-8">
            <h2 className="font-display text-2xl text-cream">Pickup</h2>
            <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-parchment">
              Order ahead and skip the wait. Your food will be ready and
              fresh off the grill when you arrive.
            </p>
            <p className="mt-6 font-sans text-sm text-muted">
              Build your order below, or call{" "}
              <a href={businessConfig.phoneHref} className="text-gold-bright hover:underline">
                {businessConfig.phone}
              </a>{" "}
              or{" "}
              <a
                href={businessConfig.phoneSecondaryHref}
                className="text-gold-bright hover:underline"
              >
                {businessConfig.phoneSecondary}
              </a>
              .
            </p>
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
              for the table, and for the office party, the backyard
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

      <section className="relative bg-ink pb-24">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="section-kicker text-lg md:text-xl">Build Your Order</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-cream md:text-4xl">
              What Are You Craving?
            </h2>
            <p className="mt-4 font-sans text-sm leading-relaxed text-parchment md:text-base">
              Add items from the menu, then choose pickup or delivery.
              Payment is completed online through our secure checkout to
              confirm your order.
            </p>
          </div>

          <div className="mt-14">
            <OrderBuilder />
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

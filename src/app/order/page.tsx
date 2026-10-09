import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import AlcoholPolicyNotice from "@/components/AlcoholPolicyNotice";
import DeliveryAppButton from "@/components/DeliveryAppButton";
import DeliveryZones from "@/components/DeliveryZones";
import HoursList from "@/components/HoursList";
import OrderBuilder from "@/components/OrderBuilder";
import { businessConfig } from "@/config/business";
import { pageMeta } from "@/lib/seo";

/**
 * Online ordering was paused 2026-08-27 at the client's request
 * (businessConfig.onlineOrderingEnabled). While it is off, this route stays
 * live on purpose — existing links and printed material point here, and a 404
 * would turn a temporary pause into a dead end. It renders a call-us page
 * titled "Call to Order" instead of the order builder, and asks search engines
 * to leave it out of results (noindex, follow) so nobody lands on it from a
 * search for online ordering. Turning the switch back on restores the title,
 * the H1, indexing and the sitemap entry together.
 */
const orderingPaused = !businessConfig.onlineOrderingEnabled;

export const metadata = orderingPaused
  ? pageMeta(
      "/order",
      "Call to Order, Pickup in Franklin Square",
      `Online ordering is paused. Call ${businessConfig.phone} or ${businessConfig.phoneSecondary} to order pickup from ${businessConfig.name}, 885 Hempstead Tpke, Franklin Square.`,
      { robots: { index: false, follow: true } }
    )
  : pageMeta(
      "/order",
      "Order Online for Pickup and Delivery",
      // PART0: 0.5 "Latin American grill" follows the site's current wording.
      `Order pickup or delivery from ${businessConfig.name}, the Latin American grill at 885 Hempstead Tpke, Franklin Square, NY.`
    );

/** The two call buttons. While ordering is paused they sit in the page header, on the first phone screen. */
function CallButtons() {
  return (
    <div className="flex flex-col justify-center gap-3 sm:flex-row">
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
  );
}

/** What still works while ordering is paused: the phone (buttons in the header), hours and catering. */
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
        Online orders are off for now, so nothing gets placed or paid for on
        the website. The kitchen is still on the grill. Give us a call and
        we&rsquo;ll take your order.
      </p>

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
            Catering and bulk orders still run as usual, through a request
            form.
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
          title="Call to Order"
          description="Online ordering is paused. Call us and we'll have your order ready for pickup."
        >
          <CallButtons />
        </PageHeader>

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

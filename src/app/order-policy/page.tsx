import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import LegalDocument, { LegalSection } from "@/components/LegalDocument";
import { businessConfig } from "@/config/business";
import { legalConfig } from "@/config/legal";

export const metadata: Metadata = {
  title: "Order & Cancellation Policy",
  description:
    "How online orders work at En Llamas 87 — payment, pickup and delivery, cancellations, refunds, and catering deposits.",
};

export default function OrderPolicyPage() {
  return (
    <>
      <PageHeader
        kicker="Before You Order"
        title="Order & Cancellation Policy"
        description="How online orders are taken and paid for, and what happens if something needs to change."
      />

      <LegalDocument>
        <LegalSection heading="Who you are buying from">
          <p>
            Online orders are sold by {legalConfig.entityName},{" "}
            {businessConfig.address.full}. Phone {businessConfig.phone}. Email{" "}
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>
            .
          </p>
        </LegalSection>

        <LegalSection heading="Placing an order">
          <p>
            Choose your items, tell us whether you want pickup or delivery, and
            pay at checkout. Your order is not confirmed when you press the
            button — it is confirmed when you receive our confirmation and the
            payment clears.
          </p>
          <p>
            We can decline an order and refund it in full if the kitchen is at
            capacity, an item has sold out, a delivery address falls outside our
            zone, or the details given are clearly not genuine.
          </p>
        </LegalSection>

        <LegalSection heading="Prices and payment">
          <p>
            Prices are shown in US dollars and exclude sales tax unless the
            checkout says otherwise; tax is added at checkout. Card payments are
            processed by our payment provider — we never see or store your full
            card number.
          </p>
        </LegalSection>

        <LegalSection heading="Ordering hours">
          <p>
            Online ordering follows the kitchen&apos;s hours and closes{" "}
            {businessConfig.orderCutoffMinutesBeforeClose} minutes before
            closing, so nothing is left half-cooked at the end of service. If
            you place an order outside those hours the site will tell you before
            you pay.
          </p>
        </LegalSection>

        <LegalSection heading="Pickup and delivery">
          <p>
            <strong>Pickup</strong> — collect your order at{" "}
            {businessConfig.address.line1}. Bring the confirmation. Times given
            are estimates; a busy service can run long.
          </p>
          <p>
            <strong>Delivery</strong> — available inside our published delivery
            zones only. Someone must be reachable at the phone number on the
            order. If a driver cannot reach you and the food is left, we cannot
            refund it.
          </p>
        </LegalSection>

        <LegalSection heading="Changing or cancelling an order">
          <p>
            Food is made to order, so the window is short. Call us at{" "}
            {businessConfig.phone} as soon as you can.
          </p>
          <ul>
            <li>
              <strong>
                Within {legalConfig.orderCancellationMinutes} minutes of
                ordering, and before the kitchen has started it
              </strong>{" "}
              — we will cancel and refund in full.
            </li>
            <li>
              <strong>After the kitchen has started</strong> — we cannot cancel,
              because the food cannot be sold to anyone else.
            </li>
          </ul>
          <p>
            To change an order rather than cancel it, call. The website cannot
            edit an order once it is paid.
          </p>
        </LegalSection>

        <LegalSection heading="If something is wrong with your order">
          <p>
            Tell us the same day. Call {businessConfig.phone}, or write through
            the <Link href="/contact">contact form</Link>. If we got the order
            wrong, left something out, or the food was not right, we will remake
            it or refund it — your choice. We may ask for a photo for anything
            we cannot see for ourselves.
          </p>
          <p>
            Refunds go back to the card you paid with. Depending on your bank,
            it usually takes a few business days to appear.
          </p>
        </LegalSection>

        <LegalSection heading="Catering and bulk orders">
          <p>
            Catering and bulk orders are quoted individually and confirmed in
            writing before anything is charged. Because they are prepped against
            a schedule and ordered in specifically, they carry a longer notice
            period: cancel at least {legalConfig.cateringCancellationHours} hours
            before the event for a full refund of anything already paid. Inside
            that window we may keep the part already bought or prepared.
          </p>
          <p>
            The written quote we send you governs the specific event; where it
            differs from this page, the quote applies.
          </p>
        </LegalSection>

        <LegalSection heading="Third-party delivery apps">
          <p>
            Orders placed through a delivery app are that app&apos;s
            transaction, not ours. Their pricing, fees, cancellation rules and
            refunds are set by them and handled through their support — this
            page covers only orders placed on this website.
          </p>
        </LegalSection>

        <LegalSection heading="Alcohol">
          <p>
            Alcohol is not sold through this website. Any alcohol served is sold
            in the restaurant, in person, to guests of legal drinking age with
            valid ID.
          </p>
        </LegalSection>

        <LegalSection heading="Complaints">
          <p>
            If we have not resolved something to your satisfaction, write to us
            at{" "}
            <a href={`mailto:${businessConfig.email}`}>{businessConfig.email}</a>{" "}
            or through the <Link href="/contact">contact form</Link> and say
            what happened. Complaints go to the owner, not to a queue.
          </p>
        </LegalSection>
      </LegalDocument>
    </>
  );
}

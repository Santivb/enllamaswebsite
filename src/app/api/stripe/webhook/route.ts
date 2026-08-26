import { NextResponse } from "next/server";
import type Stripe from "stripe";
import {
  constructWebhookEvent,
  getStripeClient,
  PaymentsNotConfiguredError,
  WebhookNotConfiguredError,
} from "@/lib/services/payments";
import { notifyKitchen } from "@/lib/services/order-notifications";

// Signature verification and the ticket payload both need Node APIs (Buffer),
// so pin the runtime rather than relying on the default.
export const runtime = "nodejs";

/**
 * Stripe's own notification that an order was paid for.
 *
 * This — not the customer's browser — is what tells the kitchen an order came
 * in. The success page still calls /api/checkout/confirm, but only to show the
 * customer their receipt; if they close the tab the moment they pay, this
 * webhook still fires and the order still reaches the kitchen.
 *
 * `checkout.session.async_payment_succeeded` is handled too. It can't fire for
 * card payments, which is all the site takes today, but it would be the event
 * that matters the day a delayed method is enabled — and missing it then would
 * look exactly like the bug this route was written to fix.
 */
const HANDLED_EVENTS = new Set<Stripe.Event["type"]>([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  // Must be the raw body exactly as sent — parsing and re-serialising it
  // changes the bytes and the signature check fails.
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await constructWebhookEvent(payload, signature);
  } catch (err) {
    if (
      err instanceof WebhookNotConfiguredError ||
      err instanceof PaymentsNotConfiguredError
    ) {
      console.error(err.message);
      return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
    }
    // A bad signature is either a misconfigured endpoint secret or someone
    // poking at the URL. Either way Stripe should not retry it.
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, handled: false });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // The event payload doesn't include line items, and the kitchen ticket is
  // useless without them, so re-read the session with them expanded.
  let fullSession: Stripe.Checkout.Session;
  try {
    fullSession = await getStripeClient().checkout.sessions.retrieve(session.id, {
      expand: ["line_items"],
    });
  } catch (err) {
    console.error(`Could not load session ${session.id} for its line items:`, err);
    // 500 so Stripe retries — this is transient, not a bad request.
    return NextResponse.json({ error: "Could not load the order." }, { status: 500 });
  }

  if (fullSession.payment_status !== "paid") {
    return NextResponse.json({ received: true, handled: false, reason: "unpaid" });
  }

  const result = await notifyKitchen(fullSession);

  if (result.status === "failed") {
    console.error(
      `Order ${fullSession.id} reached neither the inbox nor the printer — ` +
        "asking Stripe to retry."
    );
    return NextResponse.json({ error: "Notification failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true, handled: true, ...result });
}

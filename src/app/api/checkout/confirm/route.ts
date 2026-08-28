import { NextResponse } from "next/server";
import { after } from "next/server";
import { businessConfig } from "@/config/business";
import { getCompletedCheckoutSession } from "@/lib/services/payments";
import { notifyKitchen, summarizeOrder } from "@/lib/services/order-notifications";

// notifyKitchen sends mail through nodemailer, which needs Node APIs. The
// webhook route pins the runtime for the same reason.
export const runtime = "nodejs";

// The after() callback below sends an email over SMTP once the response has
// gone out. Give it room to finish rather than being cut off mid-send.
export const maxDuration = 30;

/**
 * Backs the "thanks, your order is in" screen after Stripe redirects the
 * customer home.
 *
 * Primarily display-only. Telling the kitchen is /api/stripe/webhook's job:
 * Stripe calls it directly and retries on failure, so an order survives the
 * customer closing the tab the moment they pay.
 *
 * TEMPORARY SAFETY NET (added 2026-08-27, live incident):
 * The webhook is returning 503 "Webhook not configured." in production because
 * STRIPE_WEBHOOK_SECRET was never set on Vercel, so since the 2026-08-26 deploy
 * NO order has reached the kitchen by any path. Until that is fixed and proven,
 * this route also fires the ticket, so an order at least gets through whenever
 * the customer's browser makes it back from Stripe.
 *
 * This is safe to run alongside the webhook: notifyKitchen claims each order
 * exactly once via a marker on the Stripe PaymentIntent, which is shared state
 * across both routes, both instances and any redeploy. Whichever path arrives
 * first sends; the other gets "already-notified" and sends nothing.
 *
 * REMOVE THIS once the webhook is confirmed delivering (Stripe dashboard ->
 * Developers -> Webhooks shows 200s). This route should go back to being the
 * display-only path, because it is the weaker one — it depends on the browser
 * coming back, and it cannot retry.
 */
export async function GET(request: Request) {
  // Online-ordering pause (businessConfig.onlineOrderingEnabled, paused
  // 2026-08-27). Refuses before any Stripe call. Stripe's own webhook at
  // /api/stripe/webhook is deliberately NOT gated, so a session that was
  // already paid for still reaches the kitchen by that path.
  if (!businessConfig.onlineOrderingEnabled) {
    return NextResponse.json(
      {
        error:
          "Online ordering is temporarily unavailable. If you believe you were " +
          `charged, call us right away: ${businessConfig.phone} or ${businessConfig.phoneSecondary}.`,
        orderingPaused: true,
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  let session;
  try {
    session = await getCompletedCheckoutSession(sessionId);
  } catch (err) {
    console.error("Failed to verify checkout session:", err);
    return NextResponse.json({ error: "Could not verify payment." }, { status: 500 });
  }

  if (!session) {
    return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
  }

  // Runs after the response is sent, so a slow or failing mail server can
  // never delay or break the receipt the customer is looking at.
  after(async () => {
    try {
      const result = await notifyKitchen(session);
      if (result.status === "notified") {
        console.warn(
          `SAFETY NET: order ${session.id} was sent to the kitchen by the confirm ` +
            "route, not the webhook. If this keeps appearing, the Stripe webhook " +
            "is still not delivering."
        );
      }
    } catch (err) {
      // The webhook is the real path; never surface this to the customer.
      console.error(`Safety-net notification failed for ${session.id}:`, err);
    }
  });

  const order = summarizeOrder(session);

  return NextResponse.json({
    ok: true,
    name: order.name,
    itemsSummary: order.itemsSummary,
    total: order.total,
    fulfillment: order.fulfillment,
    address: order.address,
  });
}

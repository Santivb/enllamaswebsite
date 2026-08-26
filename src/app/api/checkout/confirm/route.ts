import { NextResponse } from "next/server";
import { getCompletedCheckoutSession } from "@/lib/services/payments";
import { summarizeOrder } from "@/lib/services/order-notifications";

/**
 * Backs the "thanks, your order is in" screen after Stripe redirects the
 * customer home.
 *
 * This route is display-only. It used to be what emailed the kitchen, which
 * meant an order only reached the restaurant if the customer's browser made it
 * back from Stripe — close the tab after paying and the order vanished. That
 * job now belongs to /api/stripe/webhook, which Stripe calls directly and
 * retries on failure. Nothing here should ever be the only path to the kitchen
 * again.
 */
export async function GET(request: Request) {
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

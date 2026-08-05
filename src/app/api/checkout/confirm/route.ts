import { NextResponse } from "next/server";
import { getCompletedCheckoutSession } from "@/lib/services/payments";
import { sendInquiryEmail } from "@/lib/services/email";

// Guards against emailing the kitchen twice if the customer reloads the
// success page. Resets on server restart — fine at this order volume; a
// persistent store would be needed for stronger guarantees.
const confirmedSessions = new Set<string>();

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

  const itemsSummary =
    session.line_items?.data
      .map(
        (line) =>
          `${line.quantity}x ${line.description} ($${((line.amount_total ?? 0) / 100).toFixed(2)})`
      )
      .join("; ") || "";
  const total = `$${((session.amount_total ?? 0) / 100).toFixed(2)}`;
  const name = session.metadata?.name || "Guest";
  const phone = session.metadata?.phone || undefined;
  const fulfillment = session.metadata?.fulfillment || "Pickup";
  const notes = session.metadata?.notes || undefined;
  const email = session.customer_details?.email || "";

  if (!confirmedSessions.has(sessionId)) {
    confirmedSessions.add(sessionId);
    try {
      await sendInquiryEmail({
        type: "order",
        name,
        email,
        phone,
        message: notes || "(none provided)",
        details: {
          Fulfillment: fulfillment,
          Items: itemsSummary,
          "Order Total (paid online)": total,
          Payment: "Paid online via Stripe",
        },
      });
    } catch (err) {
      // Payment already succeeded — don't fail the confirmation over a
      // notification-email hiccup, just log it for follow-up.
      console.error("Failed to send order confirmation email:", err);
    }
  }

  return NextResponse.json({ ok: true, name, itemsSummary, total, fulfillment });
}

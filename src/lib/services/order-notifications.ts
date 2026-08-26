import type Stripe from "stripe";
import { getStripeClient } from "./payments";
import { sendInquiryEmail, type EmailInquiry } from "./email";
import { sendTicketToPrinter, PrintNotConfiguredError } from "./print";

/**
 * Metadata key used to record that the kitchen has already been told about an
 * order. See claimNotification below for why this lives on Stripe rather than
 * in a database.
 */
const NOTIFIED_KEY = "enllamas_kitchen_notified_at";

export type OrderSummary = {
  name: string;
  email: string;
  phone?: string;
  fulfillment: string;
  address?: string;
  notes?: string;
  itemsSummary: string;
  total: string;
};

/** Flattens a completed Checkout Session into the fields the kitchen needs. */
export function summarizeOrder(session: Stripe.Checkout.Session): OrderSummary {
  const itemsSummary =
    session.line_items?.data
      .map(
        (line) =>
          `${line.quantity}x ${line.description} ($${((line.amount_total ?? 0) / 100).toFixed(2)})`
      )
      .join("; ") || "";

  return {
    name: session.metadata?.name || "Guest",
    email: session.customer_details?.email || "",
    phone: session.metadata?.phone || undefined,
    fulfillment: session.metadata?.fulfillment || "Pickup",
    address: session.metadata?.address || undefined,
    notes: session.metadata?.notes || undefined,
    itemsSummary,
    total: `$${((session.amount_total ?? 0) / 100).toFixed(2)}`,
  };
}

/** Builds the ticket payload shared by the email and the receipt printer. */
export function toInquiry(order: OrderSummary): EmailInquiry {
  return {
    type: "order",
    name: order.name,
    email: order.email,
    phone: order.phone,
    message: order.notes || "(none provided)",
    details: {
      Fulfillment: order.fulfillment,
      ...(order.address ? { "Delivery Address": order.address } : {}),
      Items: order.itemsSummary,
      "Order Total (paid online)": order.total,
      Payment: "Paid online via Stripe",
    },
  };
}

type ClaimResult = "claimed" | "already-notified" | "store-unavailable";

function getPaymentIntentId(session: Stripe.Checkout.Session): string | null {
  const pi = session.payment_intent;
  if (!pi) return null;
  return typeof pi === "string" ? pi : pi.id;
}

/**
 * Tries to claim the right to notify the kitchen about this order, exactly once.
 *
 * The marker is written to the order's PaymentIntent metadata in Stripe. That
 * is a deliberate choice: this project has no database, and standing up a KV
 * store would need an account and credentials nobody can provision right now —
 * the same blocker that keeps the PrintNode key empty. Stripe is already the
 * system of record for the order, the marker survives cold starts, redeploys
 * and instance changes (which was the actual bug in the old in-memory Set),
 * and it costs nothing. If a KV store or database is added later, this
 * function and releaseNotification are the only two places that change.
 *
 * Returns "store-unavailable" rather than throwing if Stripe won't take the
 * marker. Callers should notify anyway in that case: a missed order is worse
 * than a duplicate one, so this fails open by design.
 */
async function claimNotification(
  session: Stripe.Checkout.Session
): Promise<ClaimResult> {
  const paymentIntentId = getPaymentIntentId(session);
  if (!paymentIntentId) {
    console.warn(
      `Session ${session.id} has no PaymentIntent — cannot dedupe this notification.`
    );
    return "store-unavailable";
  }

  const stripe = getStripeClient();
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.metadata?.[NOTIFIED_KEY]) return "already-notified";

    await stripe.paymentIntents.update(paymentIntentId, {
      metadata: { ...intent.metadata, [NOTIFIED_KEY]: new Date().toISOString() },
    });
    return "claimed";
  } catch (err) {
    console.error(
      `Could not read/write the notification marker for ${paymentIntentId}:`,
      err
    );
    return "store-unavailable";
  }
}

/**
 * Gives the claim back, so Stripe's next webhook retry gets a fresh attempt.
 * Only called when every notification channel failed.
 */
async function releaseNotification(session: Stripe.Checkout.Session): Promise<void> {
  const paymentIntentId = getPaymentIntentId(session);
  if (!paymentIntentId) return;

  try {
    // Posting an empty value unsets an individual metadata key in Stripe.
    await getStripeClient().paymentIntents.update(paymentIntentId, {
      metadata: { [NOTIFIED_KEY]: "" },
    });
  } catch (err) {
    console.error(`Could not release the notification marker for ${paymentIntentId}:`, err);
  }
}

export type NotifyResult = {
  status: "notified" | "already-notified" | "failed";
  emailed: boolean;
  printed: boolean;
};

/**
 * Tells the kitchen about a paid order — by email and by receipt printer.
 *
 * The two channels are independent on purpose. Printing is the new, less
 * proven path; if PrintNode is down, unconfigured, or the printer is unplugged,
 * the email must still land. The reverse holds too. Only if *both* fail does
 * this report failure, which is the caller's signal to let Stripe retry.
 */
export async function notifyKitchen(
  session: Stripe.Checkout.Session
): Promise<NotifyResult> {
  const claim = await claimNotification(session);
  if (claim === "already-notified") {
    return { status: "already-notified", emailed: false, printed: false };
  }

  const inquiry = toInquiry(summarizeOrder(session));

  const [emailOutcome, printOutcome] = await Promise.allSettled([
    sendInquiryEmail(inquiry),
    sendTicketToPrinter(inquiry),
  ]);

  const emailed = emailOutcome.status === "fulfilled";
  if (!emailed) {
    console.error("Failed to email the order ticket:", emailOutcome.reason);
  }

  let printed = printOutcome.status === "fulfilled";
  if (printOutcome.status === "rejected") {
    if (printOutcome.reason instanceof PrintNotConfiguredError) {
      // Expected until the owner creates the PrintNode account — log it at
      // info level so it doesn't read as a fault in the logs.
      console.info("Receipt printing skipped:", printOutcome.reason.message);
    } else {
      console.error("Failed to print the order ticket:", printOutcome.reason);
    }
  } else {
    printed = true;
    console.info(`Order ticket sent to the printer (PrintNode job ${printOutcome.value}).`);
  }

  if (!emailed && !printed) {
    // Nobody in the kitchen knows about this order. Hand the claim back so
    // Stripe's retry can try again rather than being deduped away.
    if (claim === "claimed") await releaseNotification(session);
    return { status: "failed", emailed, printed };
  }

  if (claim === "store-unavailable") {
    console.warn(
      `Order ${session.id} was notified without a dedupe marker — a webhook ` +
        "retry could produce a second ticket."
    );
  }

  return { status: "notified", emailed, printed };
}

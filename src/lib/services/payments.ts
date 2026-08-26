import Stripe from "stripe";

export type CheckoutLineItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
};

export type CheckoutMetadata = {
  name: string;
  phone?: string;
  fulfillment: string;
  address?: string;
  notes?: string;
};

export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super(
      "Online payments aren't configured yet. Set STRIPE_SECRET_KEY in " +
        ".env.local — see .env.example."
    );
    this.name = "PaymentsNotConfiguredError";
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeClient(): Stripe {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export class WebhookNotConfiguredError extends Error {
  constructor() {
    super(
      "The Stripe webhook isn't configured yet. Set STRIPE_WEBHOOK_SECRET in " +
        ".env.local — see .env.example."
    );
    this.name = "WebhookNotConfiguredError";
  }
}

export function isWebhookConfigured(): boolean {
  return Boolean(process.env.STRIPE_WEBHOOK_SECRET);
}

/**
 * Verifies a Stripe webhook signature and returns the parsed event.
 *
 * `payload` must be the raw request body exactly as received — parsing and
 * re-serialising the JSON changes the bytes and the signature will not match.
 *
 * Uses constructEventAsync because signature verification runs on the Web
 * Crypto API here, which is async.
 */
export async function constructWebhookEvent(
  payload: string,
  signature: string
): Promise<Stripe.Event> {
  if (!isStripeConfigured()) throw new PaymentsNotConfiguredError();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new WebhookNotConfiguredError();

  return getStripeClient().webhooks.constructEventAsync(payload, signature, secret);
}

/** Creates a hosted Stripe Checkout session for a cart and returns its URL. */
export async function createCheckoutSession(
  items: CheckoutLineItem[],
  opts: {
    customerEmail: string;
    metadata: CheckoutMetadata;
    successUrl: string;
    cancelUrl: string;
  }
): Promise<{ url: string }> {
  if (!isStripeConfigured()) {
    throw new PaymentsNotConfiguredError();
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: items.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.unitPriceCents,
        product_data: { name: item.name },
      },
    })),
    customer_email: opts.customerEmail,
    metadata: {
      name: opts.metadata.name,
      phone: opts.metadata.phone ?? "",
      fulfillment: opts.metadata.fulfillment,
      address: (opts.metadata.address ?? "").slice(0, 450),
      notes: (opts.metadata.notes ?? "").slice(0, 450),
    },
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL.");
  }
  return { url: session.url };
}

/** Retrieves a Checkout session and returns it only if payment succeeded. */
export async function getCompletedCheckoutSession(
  sessionId: string
): Promise<Stripe.Checkout.Session | null> {
  if (!isStripeConfigured()) {
    throw new PaymentsNotConfiguredError();
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });

  if (session.payment_status !== "paid") return null;
  return session;
}

/**
 * Stripe checkout scaffold — not yet active.
 *
 * To activate: `npm install stripe`, set STRIPE_SECRET_KEY and
 * NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (see .env.example), then implement the
 * body of createCheckoutSession below using the Stripe SDK's
 * `stripe.checkout.sessions.create(...)`. The call site (the future
 * /api/checkout route and the Order Online page) is written against this
 * function signature so wiring in the real SDK is a self-contained change.
 */

export type CheckoutLineItem = {
  name: string;
  quantity: number;
  unitPriceCents: number;
};

export class PaymentsNotConfiguredError extends Error {
  constructor() {
    super(
      "Payments aren't configured yet. Install the `stripe` package and " +
        "set STRIPE_SECRET_KEY in .env.local — see .env.example."
    );
    this.name = "PaymentsNotConfiguredError";
  }
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createCheckoutSession(
  _items: CheckoutLineItem[],
  _opts: { successUrl: string; cancelUrl: string }
): Promise<{ url: string }> {
  if (!isStripeConfigured()) {
    throw new PaymentsNotConfiguredError();
  }
  // TODO: implement with the Stripe SDK once installed & configured:
  //   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  //   const session = await stripe.checkout.sessions.create({
  //     mode: "payment",
  //     payment_method_types: ["card"], // Apple Pay / Google Pay surface
  //     line_items: items.map(...),      // automatically via Payment Request
  //     success_url: opts.successUrl,    // Button once enabled in Stripe.
  //     cancel_url: opts.cancelUrl,
  //   });
  //   return { url: session.url! };
  throw new PaymentsNotConfiguredError();
}

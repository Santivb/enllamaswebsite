import { NextResponse } from "next/server";
import {
  createCheckoutSession,
  PaymentsNotConfiguredError,
  type CheckoutLineItem,
} from "@/lib/services/payments";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { items, customerEmail, name, phone, fulfillment, notes } = body as Record<
    string,
    unknown
  >;

  if (typeof customerEmail !== "string" || !/^\S+@\S+\.\S+$/.test(customerEmail)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }
  if (typeof name !== "string" || name.trim().length < 2) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof fulfillment !== "string") {
    return NextResponse.json({ error: "Invalid fulfillment." }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const lineItems: CheckoutLineItem[] = [];
  for (const raw of items) {
    if (
      typeof raw !== "object" ||
      raw === null ||
      typeof (raw as Record<string, unknown>).name !== "string" ||
      typeof (raw as Record<string, unknown>).quantity !== "number" ||
      typeof (raw as Record<string, unknown>).unitPriceCents !== "number"
    ) {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }
    const item = raw as { name: string; quantity: number; unitPriceCents: number };
    lineItems.push(item);
  }

  const origin = new URL(request.url).origin;

  try {
    const { url } = await createCheckoutSession(lineItems, {
      customerEmail,
      metadata: {
        name,
        phone: typeof phone === "string" ? phone : undefined,
        fulfillment,
        notes: typeof notes === "string" ? notes : undefined,
      },
      successUrl: `${origin}/order?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/order?payment=cancelled`,
    });
    return NextResponse.json({ url });
  } catch (err) {
    if (err instanceof PaymentsNotConfiguredError) {
      console.error(err.message);
      return NextResponse.json(
        {
          error:
            "Online payment isn't set up yet — please choose pay at pickup/delivery.",
        },
        { status: 503 }
      );
    }
    console.error("Failed to create checkout session:", err);
    return NextResponse.json(
      { error: "Something went wrong starting checkout. Please try again." },
      { status: 500 }
    );
  }
}

"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { menuCategories } from "@/lib/menu-data";
import { getOrderingStatus, type OrderingStatus } from "@/lib/order-hours";
import PhoneLinks from "./PhoneLinks";

type OrderableItem = {
  id: string;
  name: string;
  description?: string;
  priceValue: number;
  priceLabel: string;
};

type OrderableCategory = {
  id: string;
  title: string;
  items: OrderableItem[];
};

// Reads the noun for a protein/style variant, e.g. "Chicken" + "Taco" -> "Chicken Taco".
const VARIANT_NOUN: Record<string, string> = {
  nachos: "Nachos",
  tacos: "Taco",
  quesadillas: "Quesadilla",
  tortas: "Torta",
  burritos: "Burrito",
};

/** Parses a single leading dollar amount ("$14", "$5 each") — returns null for
 *  dual/variable pricing ("$30 / $55") that doesn't fit a flat qty x price model. */
function parsePriceValue(price?: string): number | null {
  if (!price || price.includes("/")) return null;
  const match = price.match(/^\$([\d.]+)/);
  if (!match) return null;
  const value = parseFloat(match[1]);
  return Number.isFinite(value) ? value : null;
}

function buildOrderableCategories(): OrderableCategory[] {
  const categories: OrderableCategory[] = [];

  for (const category of menuCategories) {
    const items: OrderableItem[] = [];

    for (const item of category.items ?? []) {
      const priceValue = parsePriceValue(item.price);
      if (priceValue === null) continue;
      items.push({
        id: `${category.id}-${item.name}`,
        name: item.name,
        description: item.description,
        priceValue,
        priceLabel: item.price!,
      });
    }

    for (const group of category.variantGroups ?? []) {
      const priceValue = parsePriceValue(group.price);
      if (priceValue === null) continue;
      const noun = VARIANT_NOUN[category.id] ?? category.title;
      for (const variant of group.items) {
        items.push({
          id: `${category.id}-${variant}-${group.price}`,
          name: `${variant} ${noun}`,
          priceValue,
          priceLabel: group.price,
        });
      }
    }

    if (items.length > 0) {
      categories.push({ id: category.id, title: category.title, items });
    }
  }

  return categories;
}

const inputClasses =
  "w-full rounded-sm border border-line bg-charcoal/60 px-4 py-3 font-sans text-sm text-cream placeholder:text-parchment/40 outline-none transition-colors focus:border-gold";
const labelClasses = "mb-2 block text-[11px] uppercase tracking-[0.2em] text-gold";

type Status =
  | "idle"
  | "submitting"
  | "success"
  | "error"
  | "not-configured"
  | "confirming-payment"
  | "payment-success"
  | "payment-error";

type PaymentConfirmation = {
  itemsSummary: string;
  total: string;
  fulfillment: string;
};

export default function OrderBuilder() {
  const categories = useMemo(() => buildOrderableCategories(), []);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"in-person" | "online">("in-person");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentConfirmation, setPaymentConfirmation] = useState<PaymentConfirmation | null>(
    null
  );
  const [cancelledNotice, setCancelledNotice] = useState(false);

  // Computed client-side only (depends on the current time) so the
  // server-rendered markup doesn't mismatch the browser's clock on hydration.
  const [orderingStatus, setOrderingStatus] = useState<OrderingStatus | null>(null);
  useEffect(() => {
    setOrderingStatus(getOrderingStatus());
    const interval = setInterval(() => setOrderingStatus(getOrderingStatus()), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Picks up after a redirect back from Stripe Checkout (success or cancel)
  // and confirms the payment server-side before showing a result.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (!payment) return;

    window.history.replaceState({}, "", "/order");

    if (payment === "success") {
      const sessionId = params.get("session_id");
      if (!sessionId) return;
      setStatus("confirming-payment");
      fetch(`/api/checkout/confirm?session_id=${encodeURIComponent(sessionId)}`)
        .then(async (res) => {
          if (!res.ok) throw new Error("Payment could not be confirmed.");
          return res.json();
        })
        .then((data) => {
          setPaymentConfirmation({
            itemsSummary: data.itemsSummary,
            total: data.total,
            fulfillment: data.fulfillment,
          });
          setStatus("payment-success");
        })
        .catch(() => setStatus("payment-error"));
    } else if (payment === "cancelled") {
      setCancelledNotice(true);
    }
  }, []);

  // Reads the current quantity from `prev` inside the updater (not from the
  // outer `cart` closure) so two rapid clicks on the same button both land —
  // otherwise both onClick handlers would compute their target from the same
  // stale value and the second click would silently overwrite the first.
  const adjustQty = (id: string, delta: number) => {
    setCart((prev) => {
      const nextQty = (prev[id] || 0) + delta;
      const next = { ...prev };
      if (nextQty <= 0) delete next[id];
      else next[id] = nextQty;
      return next;
    });
  };

  const allItems = useMemo(() => categories.flatMap((c) => c.items), [categories]);
  const cartLines = allItems
    .filter((item) => cart[item.id] > 0)
    .map((item) => ({ ...item, qty: cart[item.id] }));
  const total = cartLines.reduce((sum, line) => sum + line.qty * line.priceValue, 0);
  const itemCount = cartLines.reduce((sum, line) => sum + line.qty, 0);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartLines.length === 0) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    setStatus("submitting");
    setErrorMessage(null);

    const itemsSummary = cartLines
      .map((line) => `${line.qty}x ${line.name} ($${(line.qty * line.priceValue).toFixed(2)})`)
      .join("; ");

    if (paymentMethod === "online") {
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartLines.map((line) => ({
              name: line.name,
              quantity: line.qty,
              unitPriceCents: Math.round(line.priceValue * 100),
            })),
            customerEmail: formData.get("email"),
            name: formData.get("name"),
            phone: formData.get("phone") || undefined,
            fulfillment: fulfillment === "pickup" ? "Pickup" : "Delivery",
            notes: formData.get("notes") || undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setErrorMessage(
            data?.error ?? "Something went wrong starting checkout. Please try again."
          );
          setStatus("error");
          return;
        }

        const { url } = await res.json();
        window.location.href = url;
      } catch {
        setErrorMessage("Something went wrong starting checkout. Please try again.");
        setStatus("error");
      }
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          message: formData.get("notes") || undefined,
          details: {
            Fulfillment: fulfillment === "pickup" ? "Pickup" : "Delivery",
            Items: itemsSummary,
            "Order Total (estimate, paid at pickup/delivery)": `$${total.toFixed(2)}`,
          },
        }),
      });

      if (res.status === 503) {
        setStatus("not-configured");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setCart({});
      form.reset();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">Order request sent.</p>
        <p className="mt-2 font-sans text-sm text-parchment">
          We&rsquo;ll confirm timing with you shortly. Payment is collected at
          pickup or delivery.
        </p>
      </div>
    );
  }

  if (status === "confirming-payment") {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">Confirming your payment...</p>
        <p className="mt-2 font-sans text-sm text-parchment">One moment.</p>
      </div>
    );
  }

  if (status === "payment-success" && paymentConfirmation) {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">Payment received. Thank you!</p>
        <p className="mt-3 font-sans text-sm text-parchment">
          {paymentConfirmation.itemsSummary}
        </p>
        <p className="mt-2 font-sans text-sm text-cream">
          Total charged: {paymentConfirmation.total}
        </p>
        <p className="mt-4 font-sans text-sm text-parchment">
          We&rsquo;ll get started on your {paymentConfirmation.fulfillment.toLowerCase()} order.
        </p>
      </div>
    );
  }

  if (status === "payment-error") {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">
          We couldn&rsquo;t confirm your payment.
        </p>
        <p className="mt-2 font-sans text-sm text-parchment">
          If you were charged, please call us and we&rsquo;ll sort it out right away.
        </p>
        <div className="mt-3 font-sans text-sm text-parchment">
          Call us: <PhoneLinks className="inline text-gold-bright" />
        </div>
      </div>
    );
  }

  if (orderingStatus && !orderingStatus.open) {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">
          {orderingStatus.reason === "closing-soon"
            ? "Online ordering has closed for tonight."
            : "We're closed right now."}
        </p>
        <p className="mt-2 font-sans text-sm text-parchment">
          {orderingStatus.reason === "closing-soon"
            ? `We stop taking online orders shortly before we close at ${orderingStatus.closesAt}.`
            : "Check our hours above, or call ahead and we'll do our best to help."}
        </p>
        <div className="mt-3 font-sans text-sm text-parchment">
          Call us: <PhoneLinks className="inline text-gold-bright" />
        </div>
      </div>
    );
  }

  if (status === "not-configured") {
    return (
      <div className="rounded-sm border border-gold/30 bg-charcoal/60 px-6 py-10 text-center">
        <p className="font-display text-xl text-gold-bright">
          Online ordering isn&rsquo;t connected yet.
        </p>
        <p className="mt-2 font-sans text-sm text-parchment">
          Please call the restaurant directly in the meantime.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-16">
      {cancelledNotice && (
        <div className="rounded-sm border border-gold/25 bg-charcoal/50 px-6 py-4 text-center font-sans text-sm text-parchment">
          Payment cancelled — no charge was made. Your cart is still below.
        </div>
      )}

      <div className="flex flex-col gap-14">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-4">
              <span className="divider-line flex-1" />
              <h3 className="section-heading whitespace-nowrap text-lg md:text-xl">
                {category.title}
              </h3>
              <span className="divider-line flex-1" />
            </div>

            <div className="mt-6 divide-y divide-line/60">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <div>
                    <p className="font-display text-base text-cream">{item.name}</p>
                    {item.description && (
                      <p className="mt-0.5 font-sans text-xs text-gold/60">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-0.5 font-sans text-xs text-gold-bright">
                      {item.priceLabel}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Remove one ${item.name}`}
                      onClick={() => adjustQty(item.id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 font-sans text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
                    >
                      &minus;
                    </button>
                    <span className="w-5 text-center font-sans text-sm tabular-nums text-cream">
                      {cart[item.id] || 0}
                    </span>
                    <button
                      type="button"
                      aria-label={`Add one ${item.name}`}
                      onClick={() => adjustQty(item.id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 font-sans text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-sm border border-gold/25 bg-charcoal/50 p-6 md:p-8">
        <h3 className="font-display text-xl text-cream">Your Order</h3>

        {cartLines.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-parchment/60 italic">
            Add items from the menu above to get started.
          </p>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              {cartLines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between font-sans text-sm text-parchment"
                >
                  <span>
                    {line.qty}&times; {line.name}
                  </span>
                  <span className="tabular-nums text-cream">
                    ${(line.qty * line.priceValue).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-4 font-display text-lg text-gold-bright">
              <span>Estimated Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>
            <p className="mt-2 font-sans text-xs text-parchment/50">
              {paymentMethod === "online"
                ? "Tax not included. You'll be redirected to Stripe's secure checkout to complete payment."
                : "Estimate only, tax not included. Payment is collected at pickup or delivery."}
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <span className={labelClasses}>Pickup or Delivery</span>
                <div className="flex gap-3">
                  {(["pickup", "delivery"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFulfillment(option)}
                      className={`rounded-full border px-5 py-2 font-sans text-xs uppercase tracking-[0.18em] transition-colors ${
                        fulfillment === option
                          ? "border-gold bg-gold text-ink"
                          : "border-gold/40 text-gold-bright hover:border-gold"
                      }`}
                    >
                      {option === "pickup" ? "Pickup" : "Delivery"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className={labelClasses}>How Would You Like to Pay?</span>
                <div className="flex flex-wrap gap-3">
                  {(["in-person", "online"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPaymentMethod(option)}
                      className={`rounded-full border px-5 py-2 font-sans text-xs uppercase tracking-[0.18em] transition-colors ${
                        paymentMethod === option
                          ? "border-gold bg-gold text-ink"
                          : "border-gold/40 text-gold-bright hover:border-gold"
                      }`}
                    >
                      {option === "online" ? "Pay Online Now" : "Pay at Pickup/Delivery"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="order-name" className={labelClasses}>
                    Name
                  </label>
                  <input id="order-name" name="name" required className={inputClasses} />
                </div>
                <div>
                  <label htmlFor="order-email" className={labelClasses}>
                    Email
                  </label>
                  <input
                    id="order-email"
                    name="email"
                    type="email"
                    required
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="order-phone" className={labelClasses}>
                  Phone <span className="normal-case text-parchment/50">(optional)</span>
                </label>
                <input id="order-phone" name="phone" type="tel" className={inputClasses} />
              </div>

              <div>
                <label htmlFor="order-notes" className={labelClasses}>
                  Notes <span className="normal-case text-parchment/50">(optional)</span>
                </label>
                <textarea
                  id="order-notes"
                  name="notes"
                  rows={3}
                  placeholder="Allergies, delivery address, anything we should know..."
                  className={`${inputClasses} resize-none`}
                />
              </div>

              {status === "error" && errorMessage && (
                <p className="font-sans text-sm text-flame-red">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full bg-gold px-8 py-3 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {status === "submitting"
                  ? paymentMethod === "online"
                    ? "Redirecting to payment..."
                    : "Sending..."
                  : paymentMethod === "online"
                    ? `Pay $${total.toFixed(2)} Now`
                    : `Submit Order (${itemCount} item${itemCount === 1 ? "" : "s"})`}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
}

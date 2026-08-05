/**
 * CENTRAL BUSINESS CONFIGURATION
 * -------------------------------------------------------------------------
 * Every public-facing business detail (name, address, hours, social links,
 * delivery-app links, maps link) lives in this one file.
 * As real information becomes available, update it here — every page reads
 * from this object, so nothing else needs to change.
 *
 * This file is safe to import from client components: it contains no
 * secrets. Payment and email API KEYS are never stored here — they're read
 * directly from environment variables in server-only code under
 * src/lib/services/. See .env.example for the full list of variables.
 */

export const businessConfig = {
  name: "En Llamas 87",
  // Used for decorative headings/wordmarks (nav, footer, section titles) —
  // the full name with "87" stays in the logo, metadata, and brand story.
  displayName: "En Llamas",
  tagline: "Amantes de la Parrilla",
  taglineEn: "Lovers of the Grill",

  address: {
    line1: "885 Hempstead Tpke",
    line2: "Franklin Square, NY 11010",
    full: "885 Hempstead Tpke, Franklin Square, NY 11010",
  },

  // From En Llamas 87's own printed menu (two lines).
  phone: "(516) 216-5439",
  phoneHref: "tel:+15162165439",
  phoneSecondary: "(516) 216-5440",
  phoneSecondaryHref: "tel:+15162165440",

  // Used as the display email and (unless overridden by the
  // CONTACT_FORM_RECIPIENT_EMAIL env var) the destination for the email
  // pipeline in src/lib/services/email.ts.
  email: "Guacmex100@gmail.com" as string | null,

  // Carried over from the same location's previous listing (Guacamole
  // Mexican Grill) — reconfirm before launch, hours may change under the
  // new brand.
  hours: [
    { day: "Monday", time: "11:00 AM – 9:00 PM" },
    { day: "Tuesday", time: "11:00 AM – 9:00 PM" },
    { day: "Wednesday", time: "Closed" },
    { day: "Thursday", time: "11:00 AM – 9:00 PM" },
    { day: "Friday", time: "11:00 AM – 10:00 PM" },
    { day: "Saturday", time: "11:00 AM – 10:00 PM" },
    { day: "Sunday", time: "12:00 PM – 8:00 PM" },
  ] as { day: string; time: string }[],

  // Days/hours delivery actually runs — narrower than the hours above.
  // Same provenance note as `hours`: carried over, reconfirm before launch.
  deliveryHours: [
    { day: "Thursday", time: "11:00 AM – 7:45 PM" },
    { day: "Friday", time: "11:00 AM – 9:45 PM" },
    { day: "Saturday", time: "11:00 AM – 9:45 PM" },
    { day: "Sunday", time: "12:00 PM – 7:45 PM" },
  ] as { day: string; time: string }[],

  // Delivery-zone minimums, carried over from the previous service area.
  // Every zone is free delivery once the minimum is met. Ordered by
  // ascending minimum for display, not by the zone's original number.
  deliveryZones: [
    { id: "zone-3", label: "Zone 3", minOrder: 20, deliveryFee: 0 },
    { id: "zone-1", label: "Zone 1", minOrder: 30, deliveryFee: 0 },
    { id: "zone-2", label: "Zone 2", minOrder: 40, deliveryFee: 0 },
  ] as { id: string; label: string; minOrder: number; deliveryFee: number }[],

  social: {
    // TODO: add the real handle/URL once each account exists. The icon
    // still renders everywhere (nav, footer, floating bar, contact card)
    // but links to "#" and is visually marked as not-yet-live until set.
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
  },

  deliveryApps: {
    // TODO: replace with the real storefront URL once onboarded on each
    // platform. See src/lib/services/delivery.ts — until a URL is set here,
    // the ordering page renders a "Coming Soon" button instead of a link.
    doordash: null as string | null,
    ubereats: null as string | null,
  },

  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=885+Hempstead+Tpke%2C+Franklin+Square%2C+NY+11010",

  story: {
    heritageName: "Guacamole Mexican Grill",
    description:
      "For years, this corner of Franklin Square was home to Guacamole Mexican Grill — a neighborhood spot where familiar faces gathered over familiar flavors. That spirit never left. It simply grew. Under the same roof and the same welcome, En Llamas 87 carries that legacy forward: a modern Latin American grill built around the open flame, honoring the dishes neighbors have loved for years while bringing new fire to the table.",
  },

  // Matches the service area previously offered by Guacamole Mexican Grill.
  // Do not add specific zip codes/distances here — actual delivery
  // eligibility is confirmed per-address at checkout once delivery is wired
  // up (see src/lib/services/delivery.ts).
  deliveryPolicyNote:
    "Our delivery area matches the same service area previously offered by Guacamole Mexican Grill. Delivery availability will be confirmed during checkout based on your address.",

  alcoholPolicyNote:
    "Alcoholic beverages are available exclusively for dine-in guests and are not eligible for delivery or takeout. Valid identification and applicable laws apply.",
} as const;

export type BusinessConfig = typeof businessConfig;

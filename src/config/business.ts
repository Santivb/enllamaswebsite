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
  // PART0: 0.1 public name. Google's listing says "En Llamas Restaurant & Bar".
  // Titles, link previews, the footer and the schema all read this.
  name: "En Llamas 87",
  // Used for decorative headings/wordmarks (nav, footer, section titles) —
  // the full name with "87" stays in the logo, metadata, and brand story.
  displayName: "En Llamas",
  tagline: "Amantes de la Parrilla",
  taglineEn: "Lovers of the Grill",

  // PART0: 0.5 how the food is described. `cuisine` is the wording used in
  // the home and menu titles and descriptions; `servesCuisine` goes into the
  // Restaurant schema. Change both here and every page follows.
  cuisine: "Modern Latin American Grill",
  servesCuisine: ["Latin American", "Grill"] as string[],

  // The live domain. Canonical URLs, Open Graph tags, the sitemap and
  // robots.txt all build off this, so it must match what the site is
  // actually served from — a stale value here points search engines and
  // link previews at a domain that does not resolve.
  siteUrl: "https://enllamasrestaurant.com",

  address: {
    line1: "885 Hempstead Tpke",
    line2: "Franklin Square, NY 11010",
    full: "885 Hempstead Tpke, Franklin Square, NY 11010",
  },

  // From En Llamas 87's own printed menu (two lines).
  // PART0: 0.2 lead phone. Google shows (516) 216-5440. To lead with it, swap
  // `phone`/`phoneHref` with the secondary pair. Page descriptions, the call
  // buttons and the schema `telephone` all read `phone`.
  phone: "(516) 216-5439",
  phoneHref: "tel:+15162165439",
  phoneSecondary: "(516) 216-5440",
  phoneSecondaryHref: "tel:+15162165440",

  // Used as the display email and (unless overridden by the
  // CONTACT_FORM_RECIPIENT_EMAIL env var) the destination for the email
  // pipeline in src/lib/services/email.ts.
  email: "Guacmex100@gmail.com" as string | null,

  // Doors-open hours — the outer window the building is open. The two
  // services below each run on their own narrower window inside these:
  // the deli/breakfast counter in the morning, the main/dinner menu from
  // late morning on. Source: the restaurant's Google Business Profile.
  // PART0: 0.3 real hours. The schema's openingHoursSpecification is built
  // from `hours`, so editing these rows updates it too.
  hours: [
    { day: "Monday", time: "6:00 AM – 9:00 PM" },
    { day: "Tuesday", time: "6:00 AM – 9:00 PM" },
    { day: "Wednesday", time: "6:00 AM – 9:00 PM" },
    { day: "Thursday", time: "6:00 AM – 9:00 PM" },
    { day: "Friday", time: "6:00 AM – 11:00 PM" },
    // No deli service on Saturday for now, so the doors open with the
    // main menu at 11 instead of at 6.
    { day: "Saturday", time: "11:00 AM – 11:00 PM" },
    { day: "Sunday", time: "12:00 PM – 8:00 PM" },
  ] as { day: string; time: string }[],

  // Deli / breakfast counter ("Comida a la Vista"). Weekdays only for now —
  // the owner wants to see how the restaurant does before adding weekends.
  breakfastHours: [
    { day: "Monday", time: "6:00 AM – 4:00 PM" },
    { day: "Tuesday", time: "6:00 AM – 4:00 PM" },
    { day: "Wednesday", time: "6:00 AM – 4:00 PM" },
    { day: "Thursday", time: "6:00 AM – 4:00 PM" },
    { day: "Friday", time: "6:00 AM – 4:00 PM" },
    { day: "Saturday", time: "Closed" },
    { day: "Sunday", time: "Closed" },
  ] as { day: string; time: string }[],

  // Main menu / dinner service. Runs every day, including Sunday when it is
  // the only service on offer.
  dinnerHours: [
    { day: "Monday", time: "11:00 AM – 9:00 PM" },
    { day: "Tuesday", time: "11:00 AM – 9:00 PM" },
    { day: "Wednesday", time: "11:00 AM – 9:00 PM" },
    { day: "Thursday", time: "11:00 AM – 9:00 PM" },
    { day: "Friday", time: "11:00 AM – 11:00 PM" },
    { day: "Saturday", time: "11:00 AM – 11:00 PM" },
    { day: "Sunday", time: "12:00 PM – 8:00 PM" },
  ] as { day: string; time: string }[],

  // ---------------------------------------------------------------------
  // ONLINE ORDERING KILL SWITCH
  //
  // PAUSED 2026-08-27 at the client's request, indefinitely ("until further
  // notice"). While this is false the site accepts no online orders at all:
  // getOrderingStatus() reports paused, /order shows a call-us notice instead
  // of the order builder, the Order CTAs become phone links, and both
  // /api/checkout and /api/checkout/confirm refuse with a 503 before any
  // Stripe call is made.
  //
  // TO RESUME ONLINE ORDERING: change `false` to `true` on the line below.
  // Nothing else needs to be touched. (`as boolean` only stops the `as const`
  // on this object from freezing the flag to the literal type `false`.)
  // ---------------------------------------------------------------------
  onlineOrderingEnabled: false as boolean,

  // Online orders stop being accepted this many minutes before closing time,
  // so the kitchen isn't left scrambling to fill an order right at close.
  orderCutoffMinutesBeforeClose: 10,

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
    instagram: "https://www.instagram.com/enllamasrestaurant/" as string | null,
    facebook: "https://www.facebook.com/enllamasrestaurant/" as string | null,
    // TODO: add the real handle/URL once a TikTok account exists.
    tiktok: null as string | null,
  },

  deliveryApps: {
    // TODO: replace with the real storefront URL once onboarded on each
    // platform. See src/lib/services/delivery.ts — until a URL is set here,
    // the ordering page renders a "Coming Soon" button instead of a link.
    doordash: null as string | null,
    ubereats: null as string | null,
  },

  // The Google listing itself, by its ID. A search for the street address
  // opens a bare pin with no restaurant on it. Checked 2026-10-09: this opens
  // "En Llamas Restaurant & Bar".
  googleMapsUrl: "https://www.google.com/maps?cid=7420858196735468351",

  // Where "Read our Google reviews" goes. The listing shows the rating and the
  // reviews. A direct review link needs the listing owner: copy it from the
  // Business Profile's "Ask for reviews" button and paste it here.
  googleReviewsUrl: "https://www.google.com/maps?cid=7420858196735468351",

  story: {
    heritageName: "Guacamole Mexican Grill",
    description:
      "For years, this corner of Franklin Square was home to Guacamole Mexican Grill, a neighborhood spot where familiar faces gathered over familiar flavors. That spirit never left. It simply grew. Under the same roof and the same welcome, En Llamas 87 carries that legacy forward: a modern Latin American grill built around the open flame, honoring the dishes neighbors have loved for years while bringing new fire to the table.",
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

/**
 * LEGAL / COMPLIANCE CONFIGURATION
 * -------------------------------------------------------------------------
 * Every fact the legal pages need that is NOT already in business.ts lives
 * here — the legal entity behind the site, the effective date of the current
 * policy text, and the order/cancellation windows the purchase terms quote.
 *
 * Like business.ts, this file is safe to import from client components: it
 * holds no secrets.
 *
 * WHY THIS FILE EXISTS
 * A delivered site is not finished without the legal set: terms of use, a
 * privacy policy, a cookie/tracking disclosure, a clear statement of who
 * operates the site, purchase terms, a cancellation & refund policy, and a
 * named channel for complaints. That is the studio house standard for every
 * delivered site: legal pages ship as part of delivery, not as an add-on.
 *
 * IMPORTANT — this is a drafted starting point, not legal advice. Anything
 * marked CONFIRM below is a fact only the owner can supply. The owner should
 * read the three pages before launch and have counsel review them if the
 * restaurant's exposure warrants it.
 */

export const legalConfig = {
  /**
   * The legal entity that operates the site and takes the orders. This is the
   * "who is responsible for this page" disclosure — it must be the registered
   * business name, not the brand name, when the two differ.
   *
   * CONFIRM: the registered entity name (e.g. "En Llamas 87 LLC") and, if the
   * brand is a DBA, the "<Entity> d/b/a En Llamas 87" form.
   */
  entityName: "En Llamas 87",
  entityType: null as string | null, // CONFIRM: "LLC" / "Corp" / sole proprietor

  /**
   * The state whose law governs the terms. Set to where the business actually
   * operates — the restaurant is in Franklin Square, NY.
   */
  governingState: "New York",

  /**
   * Shown as "Last updated" on every legal page. Bump this by hand whenever
   * the wording of a policy actually changes — a stale date on a policy the
   * owner has since changed is worse than no date.
   */
  effectiveDate: "August 25, 2026",

  /**
   * Online orders are made and paid for ahead of pickup, so the cancellation
   * window is short by nature — once the kitchen starts the ticket the food
   * cannot be re-sold.
   *
   * CONFIRM with the owner: how long after placing an order a guest can still
   * cancel for a full refund, and whether that changes for catering.
   */
  orderCancellationMinutes: 10,

  /**
   * Catering and bulk orders are prepped against a schedule, so they carry
   * their own, much longer notice period.
   *
   * CONFIRM with the owner.
   */
  cateringCancellationHours: 48,

  /**
   * Where complaints and privacy requests are received. Falls back to the
   * general business email in business.ts when no dedicated inbox exists,
   * which is the normal case for a single-location restaurant.
   */
  complaintsChannel: {
    // Set to a dedicated address if the owner ever creates one.
    email: null as string | null,
    // The contact form is the always-available written channel.
    formPath: "/contact",
  },
} as const;

export type LegalConfig = typeof legalConfig;

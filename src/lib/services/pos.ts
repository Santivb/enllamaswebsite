/**
 * POS integration scaffold (Toast / Square / Clover) — not yet active.
 * Once a provider is selected, implement menu-sync and order-push against
 * that provider's SDK here; the rest of the site shouldn't need to know
 * which POS is in use.
 */

export type PosProvider = "toast" | "square" | "clover";

export function getConfiguredPosProvider(): PosProvider | null {
  if (process.env.TOAST_API_KEY) return "toast";
  if (process.env.SQUARE_ACCESS_TOKEN) return "square";
  if (process.env.CLOVER_API_KEY) return "clover";
  return null;
}

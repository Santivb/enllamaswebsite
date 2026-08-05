import { businessConfig } from "@/config/business";

export type DeliveryAppId = "doordash" | "ubereats";

export const DELIVERY_APP_LABELS: Record<DeliveryAppId, string> = {
  doordash: "DoorDash",
  ubereats: "Uber Eats",
};

/** Returns the live storefront URL for a delivery app, or null if not yet onboarded. */
export function getDeliveryAppUrl(app: DeliveryAppId): string | null {
  return businessConfig.deliveryApps[app];
}

export function isDeliveryAppLive(app: DeliveryAppId): boolean {
  return Boolean(getDeliveryAppUrl(app));
}

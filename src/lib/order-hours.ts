import { businessConfig } from "@/config/business";

export type OrderingStatus =
  | { open: true }
  | { open: false; reason: "closed"; reopensAt?: string }
  | { open: false; reason: "closing-soon"; closesAt: string };

function parseClockTime(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function parseRange(time: string): { open: number; close: number; closeLabel: string } | null {
  if (time.trim().toLowerCase() === "closed") return null;
  const [openLabel, closeLabel] = time.split(/[–‒-]/).map((s) => s.trim());
  const open = openLabel ? parseClockTime(openLabel) : null;
  const close = closeLabel ? parseClockTime(closeLabel) : null;
  if (open === null || close === null) return null;
  return { open, close, closeLabel };
}

/** Current day name + minutes-since-midnight, in the restaurant's own timezone. */
function getNowInRestaurantTz(): { dayName: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(new Date());

  const dayName = parts.find((p) => p.type === "weekday")!.value;
  // Midnight formats as "24" in this locale's 24-hour output — normalize to 0.
  const hour = parseInt(parts.find((p) => p.type === "hour")!.value, 10) % 24;
  const minute = parseInt(parts.find((p) => p.type === "minute")!.value, 10);
  return { dayName, minutes: hour * 60 + minute };
}

/**
 * Whether the site should currently accept online orders: the restaurant
 * must be open, and outside the last-call cutoff window before closing
 * (businessConfig.orderCutoffMinutesBeforeClose).
 */
export function getOrderingStatus(): OrderingStatus {
  const { dayName, minutes: nowMinutes } = getNowInRestaurantTz();
  const todayHours = businessConfig.hours.find((h) => h.day === dayName);

  if (!todayHours) return { open: false, reason: "closed" };

  const range = parseRange(todayHours.time);
  if (!range) return { open: false, reason: "closed" };

  if (nowMinutes < range.open || nowMinutes >= range.close) {
    return { open: false, reason: "closed" };
  }

  const cutoff = range.close - businessConfig.orderCutoffMinutesBeforeClose;
  if (nowMinutes >= cutoff) {
    return { open: false, reason: "closing-soon", closesAt: range.closeLabel };
  }

  return { open: true };
}

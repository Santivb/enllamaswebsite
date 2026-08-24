import { businessConfig } from "@/config/business";

type HoursListProps = {
  variant?: "dining" | "delivery" | "breakfast" | "dinner";
  className?: string;
};

const SOURCES = {
  dining: businessConfig.hours,
  delivery: businessConfig.deliveryHours,
  breakfast: businessConfig.breakfastHours,
  dinner: businessConfig.dinnerHours,
};

/**
 * Renders one set of hours. "dining" is the doors-open window; "breakfast"
 * and "dinner" are the two services that run inside it; "delivery" is the
 * narrower window delivery actually runs.
 */
export default function HoursList({ variant = "dining", className = "" }: HoursListProps) {
  const rows = SOURCES[variant];

  return (
    <dl className={`divide-y divide-line/60 ${className}`}>
      {rows.map((row) => (
        <div key={row.day} className="flex items-center justify-between py-2">
          <dt className="font-sans text-sm text-parchment/80">{row.day}</dt>
          <dd
            className={`font-sans text-sm ${
              row.time === "Closed" ? "italic text-parchment/40" : "text-cream"
            }`}
          >
            {row.time}
          </dd>
        </div>
      ))}
    </dl>
  );
}

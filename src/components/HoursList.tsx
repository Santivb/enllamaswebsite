import { businessConfig } from "@/config/business";

type HoursListProps = {
  variant?: "dining" | "delivery";
  className?: string;
};

/** Renders either the regular dining-room hours or the (narrower) delivery hours. */
export default function HoursList({ variant = "dining", className = "" }: HoursListProps) {
  const rows =
    variant === "delivery" ? businessConfig.deliveryHours : businessConfig.hours;

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

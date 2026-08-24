import { businessConfig } from "@/config/business";

/** Delivery-zone minimums — every zone ships free once its minimum is met. */
export default function DeliveryZones({ className = "" }: { className?: string }) {
  return (
    <ul className={`space-y-2 ${className}`}>
      {businessConfig.deliveryZones.map((zone) => (
        <li
          key={zone.id}
          className="flex items-center justify-between gap-3 rounded-sm border border-line bg-ink/40 px-4 py-3"
        >
          <span className="whitespace-nowrap font-sans text-sm text-cream">
            {zone.label}
          </span>
          <span className="whitespace-nowrap font-sans text-xs text-muted">
            ${zone.minOrder} min ·{" "}
            <span className="text-gold-bright">
              {zone.deliveryFee === 0 ? "Free delivery" : `$${zone.deliveryFee} fee`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

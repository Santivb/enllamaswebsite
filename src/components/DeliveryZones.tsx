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
          {/* The minimum decides whether someone can order at all, so it takes
              the emphasis. Free delivery is the reassurance underneath, not the
              headline — it used to be the other way round, with the spend
              requirement in the quietest tone on the row. */}
          <span className="whitespace-nowrap text-right font-sans">
            <span className="text-sm text-cream">${zone.minOrder} minimum</span>
            <span className="ml-2 text-sm text-muted">
              {zone.deliveryFee === 0 ? "· free delivery" : `· $${zone.deliveryFee} fee`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}

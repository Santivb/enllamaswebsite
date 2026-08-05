import {
  DELIVERY_APP_LABELS,
  getDeliveryAppUrl,
  isDeliveryAppLive,
  type DeliveryAppId,
} from "@/lib/services/delivery";

/**
 * Renders as a real link once businessConfig.deliveryApps[app] is set;
 * until then, shows a disabled "Coming Soon" state. Adding the platform
 * later is a one-line change in src/config/business.ts — no component
 * changes needed.
 */
export default function DeliveryAppButton({ app }: { app: DeliveryAppId }) {
  const label = DELIVERY_APP_LABELS[app];
  const live = isDeliveryAppLive(app);
  const url = getDeliveryAppUrl(app);

  if (live && url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-sm border border-gold/30 bg-charcoal/50 px-6 py-4 transition-colors hover:border-gold hover:bg-gold/10"
      >
        <span className="font-display text-lg text-cream">{label}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-gold-bright">
          Order &rarr;
        </span>
      </a>
    );
  }

  return (
    <div className="flex cursor-not-allowed items-center justify-between rounded-sm border border-line bg-charcoal/30 px-6 py-4 opacity-60">
      <span className="font-display text-lg text-cream">{label}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-parchment/60">
        Coming Soon
      </span>
    </div>
  );
}

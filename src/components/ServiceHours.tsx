import { businessConfig } from "@/config/business";
import { groupHours } from "@/lib/hours";
import HoursList from "./HoursList";

type ServiceHoursProps = {
  className?: string;
};

const SERVICES = [
  { label: "Deli & Breakfast", rows: businessConfig.breakfastHours },
  { label: "Main Menu & Dinner", rows: businessConfig.dinnerHours },
];

/**
 * The full hours picture: the day-by-day doors-open window, then the two
 * services that run inside it, collapsed to a line or two each. Shared by
 * the contact page and the homepage Visit section so they can't drift.
 */
export default function ServiceHours({ className = "" }: ServiceHoursProps) {
  return (
    <div className={className}>
      <HoursList />

      <div className="mt-6 space-y-4 border-t border-line/60 pt-5">
        {SERVICES.map((service) => (
          <div key={service.label}>
            <h4 className="font-sans text-[0.7rem] uppercase tracking-[0.2em] text-gold/80">
              {service.label}
            </h4>
            <dl className="mt-1.5 space-y-1">
              {groupHours(service.rows).map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className="font-sans text-sm text-muted">{row.label}</dt>
                  <dd
                    className={`font-sans text-sm ${
                      row.time === "Closed" ? "italic text-subtle" : "text-cream"
                    }`}
                  >
                    {row.time}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

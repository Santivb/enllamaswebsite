import { businessConfig } from "@/config/business";

export default function AlcoholPolicyNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`mx-auto max-w-2xl rounded-sm border border-gold/25 bg-charcoal/50 px-6 py-5 text-center ${className}`}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-gold">
        Please Note
      </p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-parchment">
        {businessConfig.alcoholPolicyNote}
      </p>
    </div>
  );
}

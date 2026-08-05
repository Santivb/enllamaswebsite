import { businessConfig } from "@/config/business";

/** Both restaurant phone lines, each as its own tel: link. */
export default function PhoneLinks({ className = "" }: { className?: string }) {
  return (
    <p className={className}>
      <a href={businessConfig.phoneHref} className="hover:text-gold-bright">
        {businessConfig.phone}
      </a>
      <span className="mx-2 opacity-40">&middot;</span>
      <a href={businessConfig.phoneSecondaryHref} className="hover:text-gold-bright">
        {businessConfig.phoneSecondary}
      </a>
    </p>
  );
}

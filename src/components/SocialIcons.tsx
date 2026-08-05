import { getSocialUrl } from "@/lib/services/social";
import { SOCIAL_PLATFORMS, SocialIcon } from "./SocialIcon";

type Props = {
  className?: string;
  iconClassName?: string;
};

export default function SocialIcons({ className = "", iconClassName = "h-4 w-4" }: Props) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {SOCIAL_PLATFORMS.map((p) => (
        <a
          key={p.id}
          href={getSocialUrl(p.id)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={p.label}
          className="text-parchment/60 transition-all duration-300 hover:scale-110 hover:text-gold-bright hover:drop-shadow-[0_0_6px_rgba(227,181,99,0.6)]"
        >
          <SocialIcon id={p.id} className={iconClassName} />
          <span className="sr-only">{p.label}</span>
        </a>
      ))}
    </div>
  );
}

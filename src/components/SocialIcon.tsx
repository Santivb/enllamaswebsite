import type { SocialPlatform } from "@/lib/services/social";

// Instagram and TikTok aren't live yet (no real handles) — only Facebook is
// shown site-wide until those accounts exist. See businessConfig.social.
export const SOCIAL_PLATFORMS: { id: SocialPlatform; label: string }[] = [
  { id: "facebook", label: "Facebook" },
];

export function SocialIcon({
  id,
  className,
}: {
  id: SocialPlatform;
  className?: string;
}) {
  switch (id) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v7h3v-7h2.2l.8-3H14v-1.5c0-.6.3-1 1-1h1.5V8Z" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M16 4c.4 2.2 1.8 3.6 4 4v3c-1.5 0-2.9-.4-4-1.2V15a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 1 0 1 1.8V4h3Z" />
        </svg>
      );
  }
}

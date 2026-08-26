"use client";

import { useConsent } from "./ConsentProvider";

/**
 * The Google map, held behind consent.
 *
 * Until the visitor allows third-party embeds, no iframe exists in the DOM
 * at all — so no request reaches Google and it never sees the IP address.
 * The placeholder is not a dead grey box: it carries the address in plain
 * text and a direct link out, so declining costs the visitor nothing they
 * actually needed. Allowing from here records the decision globally, which
 * is why the second map on the page appears at the same time.
 */

type MapEmbedProps = {
  /** Address to plot, already the human-readable form. */
  query: string;
  /** Classes for the iframe/placeholder surface — the two must match so the
   *  layout does not jump when the map appears. */
  className?: string;
  /** Fallback link target when the visitor would rather not load Google. */
  directionsUrl: string;
};

export default function MapEmbed({ query, className = "", directionsUrl }: MapEmbedProps) {
  const { embedsAllowed, allowAll } = useConsent();

  if (embedsAllowed) {
    return (
      <iframe
        title="En Llamas 87 location map"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`}
        className={className}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 bg-charcoal/60 p-6 text-center ${className}`}
    >
      <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold">
        Map Not Loaded
      </p>
      <p className="max-w-sm font-sans text-sm leading-relaxed text-parchment">
        The map loads from Google, which can see your IP address and set its own
        cookies. We are at {query}.
      </p>
      <button
        type="button"
        onClick={allowAll}
        className="rounded-full bg-gold px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-bright"
      >
        Load the Map
      </button>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans text-[11px] uppercase tracking-[0.2em] text-subtle underline underline-offset-2 transition-colors hover:text-gold-bright"
      >
        Open in Google Maps instead
      </a>
    </div>
  );
}

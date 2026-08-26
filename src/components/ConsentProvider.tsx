"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Consent for third-party embeds, and the banner that asks for it.
 *
 * This site sets no cookies of its own and runs no analytics or advertising
 * pixel — the fonts are self-hosted by next/font at build time, and Stripe's
 * cookies are set on Stripe's own checkout pages after the visitor leaves
 * here. The one thing that genuinely reaches out to another company from
 * our pages is the embedded Google map, which loads from Google and lets it
 * see the visitor's IP address and set its own cookies.
 *
 * That is a real choice, so it gets a real Accept/Reject — but the reject
 * has to actually do something. The map is therefore never rendered as an
 * iframe until consent exists; until then `MapEmbed` shows a placeholder
 * with the address in plain text. A banner whose Reject button left the
 * iframe loading would be worse than no banner at all.
 *
 * The decision is kept in localStorage rather than a cookie: nothing on the
 * server needs to read it, so there is no reason to send it on every
 * request — and it keeps "this site sets no cookies" literally true.
 */

const STORAGE_KEY = "el87-consent";

type Decision = "all" | "essential";

type ConsentValue = {
  /** True once the visitor has explicitly allowed third-party embeds. */
  embedsAllowed: boolean;
  allowAll: () => void;
  essentialOnly: () => void;
  /** Clears the stored decision and brings the banner back. */
  reopen: () => void;
};

const ConsentContext = createContext<ConsentValue>({
  embedsAllowed: false,
  allowAll: () => {},
  essentialOnly: () => {},
  reopen: () => {},
});

export function useConsent() {
  return useContext(ConsentContext);
}

function readDecision(): Decision | null {
  // Private browsing and hardened settings can make localStorage throw on
  // access rather than return null. No stored decision means no consent,
  // which is the correct fallback: embeds stay blocked.
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "all" || stored === "essential" ? stored : null;
  } catch {
    return null;
  }
}

export default function ConsentProvider({ children }: { children: ReactNode }) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const stored = readDecision();
    if (stored) {
      setDecision(stored);
      return;
    }
    // A beat after paint, so the banner arrives over a settled page rather
    // than competing with the hero animation for attention.
    const timer = window.setTimeout(() => setBannerOpen(true), 1000);
    return () => window.clearTimeout(timer);
  }, []);

  const decide = useCallback((value: Decision) => {
    setDecision(value);
    setBannerOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Storage unavailable — the choice still applies for this page view,
      // and the banner returns next visit. Better than a dead button.
    }
  }, []);

  const allowAll = useCallback(() => decide("all"), [decide]);
  const essentialOnly = useCallback(() => decide("essential"), [decide]);

  const reopen = useCallback(() => {
    setDecision(null);
    setBannerOpen(true);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing stored to clear; the banner is open either way.
    }
  }, []);

  return (
    <ConsentContext.Provider
      value={{ embedsAllowed: decision === "all", allowAll, essentialOnly, reopen }}
    >
      {children}
      {bannerOpen && (
        <aside
          role="region"
          aria-label="Cookie and privacy choices"
          className="motion-safe:animate-[consent-in_0.5s_ease-out_both] fixed inset-x-4 bottom-4 z-[95] mx-auto max-w-2xl rounded-sm border border-gold/30 bg-charcoal/95 p-6 shadow-2xl backdrop-blur-sm md:inset-x-auto md:right-6 md:left-6"
        >
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold">
            Privacy
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-parchment">
            This site uses no analytics, advertising or tracking cookies. We
            only need your permission for the embedded Google map, which loads
            from Google — it can see your IP address and set its own cookies.
            Decline and we will show the address in plain text instead. More in
            our{" "}
            <a
              href="/privacy"
              className="text-gold underline underline-offset-2 transition-colors hover:text-gold-bright"
            >
              Privacy Policy
            </a>
            .
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={essentialOnly}
              className="flex-1 rounded-full border border-gold/40 px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold-bright"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={allowAll}
              className="flex-1 rounded-full bg-gold px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-bright"
            >
              Allow the Map
            </button>
          </div>
        </aside>
      )}
    </ConsentContext.Provider>
  );
}

"use client";

import { useConsent } from "./ConsentProvider";

/**
 * Footer control that brings the consent banner back.
 *
 * A consent decision the visitor cannot revisit is not really a choice, so
 * this sits alongside the legal links on every page. Styled to match them
 * exactly — it reads as the fourth item in that row, not as a button.
 */
export default function ConsentReopenButton() {
  const { reopen } = useConsent();

  return (
    <button
      type="button"
      onClick={reopen}
      className="cursor-pointer font-sans text-[11px] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-gold-bright"
    >
      Cookie Choices
    </button>
  );
}

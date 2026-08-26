import type { ReactNode } from "react";
import { legalConfig } from "@/config/legal";

/**
 * Shared shell for the legal pages (terms, privacy, order policy).
 *
 * Legal copy is long-form body text, which the rest of the site has no
 * pattern for — everything else is short marketing blocks. This gives the
 * three pages one readable measure, one heading rhythm, and the "last
 * updated" line they all need, without a prose plugin.
 */

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-display text-lg uppercase tracking-[0.15em] text-gold">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 font-sans text-sm leading-relaxed text-parchment [&_a]:text-gold [&_a:hover]:text-gold-bright [&_li]:leading-relaxed [&_strong]:text-cream [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

export default function LegalDocument({ children }: { children: ReactNode }) {
  return (
    <section className="relative bg-ink pb-28">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-subtle">
          Last updated {legalConfig.effectiveDate}
        </p>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

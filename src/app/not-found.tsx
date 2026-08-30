import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { businessConfig } from "@/config/business";

export const metadata: Metadata = { title: "Page not found" };

/**
 * Without this, Next serves its stock white "404 | This page could not be
 * found" panel, which overrides the site's palette and sits between our own
 * header and footer looking like a rendering failure.
 */
export default function NotFound() {
  return (
    <>
      <PageHeader
        kicker="404"
        title="We couldn't find that page."
        description="It may have moved, or the link might be wrong. The menu and ordering are both still here."
      />

      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 pb-24 text-center">
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            className="rounded-full bg-gold px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-bright"
            href="/menu"
          >
            See the menu
          </Link>
          <Link
            className="rounded-full border border-gold/40 px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-cream transition-colors hover:border-gold hover:text-gold-bright"
            href="/order"
          >
            Order online
          </Link>
        </div>
        <p className="text-sm text-subtle">
          Or call us on{" "}
          <a className="text-gold-bright" href={businessConfig.phoneHref}>
            {businessConfig.phone}
          </a>
          . {businessConfig.address.full}
        </p>
      </section>
    </>
  );
}

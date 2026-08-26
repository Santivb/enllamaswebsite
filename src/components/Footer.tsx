import { siteConfig } from "@/lib/menu-data";
import SocialIcons from "./SocialIcons";
import PaymentMethods from "./PaymentMethods";
import PhoneLinks from "./PhoneLinks";
import ConsentReopenButton from "./ConsentReopenButton";

const EXPLORE_LINKS = [
  { href: "/#story", label: "Our Story" },
  { href: "/menu", label: "Menu" },
  { href: "/drinks", label: "Drinks" },
  { href: "/gallery", label: "Gallery" },
];

const VISIT_LINKS = [
  { href: "/order", label: "Order Online" },
  { href: "/catering", label: "Catering" },
  { href: "/bulk-orders", label: "Bulk Orders" },
  { href: "/contact", label: "Contact" },
];

// House standard: every delivered site links its legal set from the footer, on
// every page.
const LEGAL_LINKS = [
  { href: "/terms", label: "Terms of Use" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/order-policy", label: "Order & Cancellation Policy" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-deep">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-lg tracking-[0.15em] text-cream">
              {siteConfig.displayName.toUpperCase()}
            </p>
            <p className="mt-1 font-script text-sm italic text-muted">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed text-muted">
              {siteConfig.address.full}
            </p>
            <PhoneLinks className="mt-2 font-sans text-sm text-muted" />
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-gold">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-muted transition-colors hover:text-gold-bright"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-gold">
              Visit
            </h3>
            <ul className="mt-4 space-y-2">
              {VISIT_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-muted transition-colors hover:text-gold-bright"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] uppercase tracking-[0.25em] text-gold">
              Follow Our Journey
            </h3>
            <p className="mt-4 font-sans text-sm text-muted">
              Find us on Instagram and Facebook.
            </p>
            <SocialIcons className="mt-4" iconClassName="h-[18px] w-[18px]" />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <div className="flex flex-col items-center gap-3 rounded-sm border border-line px-5 py-4 sm:flex-row sm:justify-between">
            <p className="text-[11px] uppercase tracking-[0.2em] text-subtle">
              Payment Methods Accepted
            </p>
            <PaymentMethods />
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-6 md:px-10">
          <nav
            aria-label="Legal"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {LEGAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-sans text-[11px] uppercase tracking-[0.2em] text-subtle transition-colors hover:text-gold-bright"
              >
                {link.label}
              </a>
            ))}
            <ConsentReopenButton />
          </nav>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-6 text-center md:flex-row md:justify-between md:px-10">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-subtle">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-subtle">
            Amantes de la Parrilla
          </p>
        </div>
      </div>
    </footer>
  );
}

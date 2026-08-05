"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { siteConfig } from "@/lib/menu-data";
import SocialIcons from "./SocialIcons";

const LINKS = [
  { href: "/#story", label: "Our Story" },
  { href: "/menu", label: "Menu" },
  { href: "/drinks", label: "Drinks" },
  { href: "/order", label: "Order Online" },
  { href: "/catering", label: "Catering" },
  { href: "/gallery", label: "Gallery" },
  { href: "/#visit", label: "Visit Us" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the fullscreen mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
        <nav
          className={`flex w-full max-w-6xl items-center justify-between rounded-full border px-5 py-3 transition-all duration-500 ${
            scrolled
              ? "border-white/10 bg-ink/80 shadow-lg shadow-black/40 backdrop-blur-xl"
              : "border-white/5 bg-white/[0.03] backdrop-blur-md"
          }`}
        >
          <Link
            href="/"
            className="whitespace-nowrap font-brand text-sm tracking-[0.15em] uppercase text-cream"
          >
            {siteConfig.displayName}
          </Link>

          <ul className="hidden items-center gap-6 lg:flex xl:gap-7">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-sans text-[11px] uppercase tracking-[0.18em] text-parchment transition-colors hover:text-gold-bright"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 lg:flex">
            <SocialIcons iconClassName="h-[15px] w-[15px]" />
            <a
              href="/order"
              className="rounded-full border border-gold/40 px-5 py-2 font-sans text-[11px] uppercase tracking-[0.18em] text-gold-bright transition-colors hover:border-gold hover:bg-gold/10"
            >
              Order
            </a>
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-1.5 lg:hidden"
          >
            <span
              className={`h-px w-6 bg-cream transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-px w-6 bg-cream transition-opacity ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-px w-6 bg-cream transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink lg:hidden"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(60% 45% at 50% 0%, var(--color-ember) 0%, transparent 70%), var(--color-ink)",
              }}
            />

            <div className="relative flex flex-1 flex-col items-center justify-center gap-2 px-6">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5 }}
                  className="py-2 font-display text-3xl text-cream transition-colors hover:text-gold-bright"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="/order"
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + LINKS.length * 0.05, duration: 0.5 }}
                className="mt-6 rounded-full border border-gold/40 px-8 py-3 font-sans text-xs uppercase tracking-[0.25em] text-gold-bright"
              >
                Order
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative flex justify-center pb-10"
            >
              <SocialIcons iconClassName="h-5 w-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSocialUrl } from "@/lib/services/social";
import { SOCIAL_PLATFORMS, SocialIcon as PlatformIcon } from "./SocialIcon";

export default function FloatingSocialBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: persistent floating column */}
      <div className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex">
        {SOCIAL_PLATFORMS.map((p) => (
          <a
            key={p.id}
            href={getSocialUrl(p.id)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={p.label}
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-subtle backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:text-gold-bright hover:shadow-[0_0_16px_rgba(227,181,99,0.35)]"
          >
            <PlatformIcon id={p.id} className="h-4 w-4" />
          </a>
        ))}
        <span className="mt-1 h-10 w-px bg-gradient-to-b from-gold/30 to-transparent" />
      </div>

      {/* Mobile: expandable floating action button */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-3 lg:hidden">
        <AnimatePresence>
          {open &&
            SOCIAL_PLATFORMS.map((p, i) => (
              <motion.a
                key={p.id}
                href={getSocialUrl(p.id)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.label}
                initial={{ opacity: 0, y: 12, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.8 }}
                transition={{ delay: i * 0.05 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 bg-ink/90 text-gold-bright shadow-lg shadow-black/40 backdrop-blur-md"
              >
                <PlatformIcon id={p.id} className="h-[18px] w-[18px]" />
              </motion.a>
            ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close social links" : "Open social links"}
          aria-expanded={open}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 bg-gold text-ink shadow-lg shadow-black/40 transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </>
  );
}

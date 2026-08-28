"use client";

import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import { gsap } from "gsap";
import { businessConfig } from "@/config/business";
import { siteConfig } from "@/lib/menu-data";
import { prefersReducedMotion } from "@/lib/motion";
import { isWebGLAvailable } from "@/lib/webgl";
import WebGLErrorBoundary from "./hero/WebGLErrorBoundary";
import LogoEmblem from "./hero/LogoEmblem";

// Atmosphere (smoke/embers) is purely decorative WebGL — client-only, and if
// it ever fails, the boundary below just renders nothing. The logo itself
// (LogoEmblem) never depends on WebGL, so it's always visible regardless.
const BackAtmosphere = dynamic(() => import("./hero/BackAtmosphere"), {
  ssr: false,
});
const FrontAtmosphere = dynamic(() => import("./hero/FrontAtmosphere"), {
  ssr: false,
});

const noopSubscribe = () => () => {};

// The WebGL canvas is a hard rectangle on all four sides — without this, the
// flame/ember effects clip abruptly at its edges instead of dissolving into
// the page background, which reads as a visible "video box" behind the logo.
// A radial (not just vertical) fade is needed so the left/right edges
// disappear too, not just the top/bottom.
const atmosphereMaskStyle: CSSProperties = {
  WebkitMaskImage:
    "radial-gradient(ellipse 62% 58% at 50% 54%, black 35%, transparent 88%)",
  maskImage:
    "radial-gradient(ellipse 62% 58% at 50% 54%, black 35%, transparent 88%)",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
};

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const webglReady = useSyncExternalStore(
    noopSubscribe,
    isWebGLAvailable,
    () => false
  );

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      gsap.set(
        [
          ".hero-emblem-stage",
          ".hero-word",
          ".hero-tagline",
          ".hero-sub",
          ".hero-cta",
          ".hero-scroll-cue",
        ],
        { opacity: 1, y: 0, x: 0, scale: 1, filter: "none" }
      );
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-emblem-stage",
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }
      )
        .fromTo(
          ".hero-word",
          { opacity: 0, y: 40, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, stagger: 0.08 },
          "-=1.0"
        )
        .fromTo(
          ".hero-tagline",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.4"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4"
        )
        .fromTo(
          ".hero-scroll-cue",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // Hero headline drops the "87" — the full name still appears in the logo,
  // nav, and everywhere else (siteConfig.name).
  const title = ["En", "Llamas"];

  return (
    <section
      id="top"
      ref={rootRef}
      // The scroll cue is absolutely positioned at bottom-8 and stands ~63px
      // tall, so it reaches 95px up from the section floor. Bottom padding has
      // to clear that zone or the cue lands on top of the CTA row at viewport
      // heights around 800px.
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ink pt-20 pb-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 28%, var(--color-ember-bright) 0%, transparent 70%), radial-gradient(90% 70% at 50% 100%, var(--color-ember) 0%, transparent 60%), var(--color-ink)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(45% 35% at 50% 0%, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex w-full max-w-full flex-col items-center px-6 text-center">
        {/* Logo stage: its own dedicated box, so the emblem is never fought
            over by the headline below — generous breathing room built in. */}
        {/* The emblem already carries the "EN LLAMAS" wordmark, and the nav and
            the headline below carry it twice more — so at its old size (66vh on
            desktop) the brand name filled the first screen three times over and
            pushed the line that says what the place actually is, plus both
            calls to action, below the fold. */}
        <div className="hero-emblem-stage relative h-[34vh] min-h-[240px] w-full max-w-[440px] sm:h-[42vh] md:h-[42vh] md:max-w-[520px]">
          {webglReady && (
            <div className="absolute inset-0 z-0" style={atmosphereMaskStyle}>
              <WebGLErrorBoundary fallback={null}>
                <BackAtmosphere />
              </WebGLErrorBoundary>
            </div>
          )}

          <div className="relative z-10 h-full w-full">
            <LogoEmblem />
          </div>

          {webglReady && (
            <div
              className="pointer-events-none absolute inset-0 z-20"
              style={atmosphereMaskStyle}
            >
              <WebGLErrorBoundary fallback={null}>
                <FrontAtmosphere />
              </WebGLErrorBoundary>
            </div>
          )}
        </div>

        <h1 className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-x-4 font-brand uppercase tracking-wide text-cream drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] [font-size:clamp(2.25rem,6vw,4.5rem)] md:mt-7">
          {title.map((word) => (
            <span key={word} className="hero-word inline-block">
              {word}
            </span>
          ))}
        </h1>

        <p className="hero-tagline mt-4 font-script text-2xl italic text-gold-bright sm:text-3xl md:mt-5 md:text-4xl">
          {siteConfig.tagline}
        </p>

        <p className="hero-sub mt-6 max-w-lg font-sans text-sm leading-relaxed text-parchment md:mt-6 md:text-base">
          A modern Latin American grill in Franklin Square, built around the
          open flame.
        </p>

        {/* Ordering is the only action here that takes money, so it holds the
            single filled button; the menu keeps an outline and Visit drops to
            a text link. One filled control means the hierarchy reads at a
            glance instead of two equals competing. */}
        <div className="hero-cta mt-7 flex flex-col items-center gap-4 sm:flex-row md:mt-8">
          {/* Online ordering paused 2026-08-27 (businessConfig
              .onlineOrderingEnabled). The filled button keeps its slot in the
              hierarchy, but it dials the restaurant instead of opening a
              checkout that would refuse the order anyway. */}
          <a
            href={
              businessConfig.onlineOrderingEnabled
                ? "/order"
                : businessConfig.phoneHref
            }
            className="rounded-full bg-gold px-8 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-ink transition-colors hover:bg-gold-bright"
          >
            {businessConfig.onlineOrderingEnabled ? "Order Online" : "Call to Order"}
          </a>
          <a
            href="/menu"
            className="rounded-full border border-cream/30 px-8 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-cream transition-colors hover:border-cream"
          >
            Explore the Menu
          </a>
          <a
            href="#visit"
            // py-3.5 is purely tap area — it keeps the link visually quiet while
            // giving it a 44px target, the same minimum the two buttons meet.
            className="px-2 py-3.5 font-sans text-xs uppercase tracking-[0.25em] text-muted underline-offset-8 transition-colors hover:text-gold-bright hover:underline sm:ml-1"
          >
            Visit Us
          </a>
        </div>
      </div>

      <div className="hero-scroll-cue absolute bottom-8 z-20 flex flex-col items-center gap-2 text-subtle">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
      </div>
    </section>
  );
}

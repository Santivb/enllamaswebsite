"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion";

type GalleryVideoProps = {
  src: string;
  poster: string;
  width: number;
  height: number;
  label: string;
};

/**
 * A gallery clip that only plays while it is actually on screen.
 *
 * The twelve clips on this page come to 26MB. Left on plain `autoPlay` they
 * all decode and loop whether or not anyone can see them, which on a phone is
 * a lot of data and battery spent on video nobody is watching. There is also
 * no `autoPlay` attribute here at all: playback is driven from the observer,
 * so the server and client render identical markup and the reduced-motion
 * branch can be decided on the client without a hydration mismatch.
 *
 * When the visitor prefers reduced motion, nothing moves on its own — the clip
 * renders as its poster with native controls, so it can still be watched, just
 * deliberately.
 */
export default function GalleryVideo({ src, poster, width, height, label }: GalleryVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Rejects when the browser blocks autoplay; the poster stays up,
          // which is a fine outcome and not worth surfacing.
          void el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      // A little margin so a clip is already running by the time it is fully
      // in view, rather than visibly starting from a still.
      { rootMargin: "150px 0px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <div className="group relative mb-4 break-inside-avoid overflow-hidden rounded-sm border border-line">
      <video
        ref={ref}
        src={src}
        poster={poster}
        width={width}
        height={height}
        className="h-auto w-full"
        muted
        loop
        playsInline
        preload="none"
        controls={reduced}
      />
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-3 pb-2 pt-6 font-sans text-[11px] uppercase tracking-[0.15em] text-parchment">
        {label}
      </span>
    </div>
  );
}

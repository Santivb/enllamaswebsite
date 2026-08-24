"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { registerSmoothScroll } from "@/lib/smooth-scroll";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    registerSmoothScroll(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      registerSmoothScroll(null);
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
}

"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { revealOnScroll } from "@/lib/motion";
import { businessConfig } from "@/config/business";
import { groupHours } from "@/lib/hours";

gsap.registerPlugin(ScrollTrigger);

// The counter runs on the deli/breakfast window, so read it straight from
// the config instead of restating the times here.
const COUNTER_HOURS = groupHours(businessConfig.breakfastHours)
  .filter((row) => row.time !== "Closed")
  .map((row) => `${row.label} · ${row.time}`)
  .join("  ·  ");

const FEATURES = [
  {
    title: "Fresh Every Day",
    description: "Made with quality ingredients. Made with care.",
  },
  {
    title: "Made to Satisfy",
    description: "Hearty portions. Bold flavors.",
  },
  {
    title: "Latin Soul",
    description: "Authentic taste in every bite.",
  },
  {
    title: "Always Fresh",
    description: "Real food. Real good.",
  },
];

export default function OnsiteFoodSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(
        ".onsite-reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
        <p className="onsite-reveal section-kicker text-lg md:text-xl">
          Comida a la Vista
        </p>
        <h2 className="onsite-reveal mt-3 font-display text-4xl font-bold tracking-tight text-cream md:text-5xl">
          Onsite Food, Made Fresh Daily
        </h2>
        <p className="onsite-reveal mx-auto mt-5 max-w-xl font-sans text-base leading-relaxed text-parchment md:text-lg">
          Fresh, homestyle Latin flavors, made for you. Come in, eat well,
          feel at home.
        </p>

        <div className="onsite-reveal mt-14 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="border-t border-line pt-4">
              <h3 className="font-display text-base text-gold-bright md:text-lg">
                {feature.title}
              </h3>
              <p className="mt-1 font-sans text-xs leading-relaxed text-parchment/80 md:text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <p className="onsite-reveal mt-14 font-sans text-xs uppercase tracking-[0.25em] text-gold">
          Onsite Counter &middot; {COUNTER_HOURS}
        </p>
      </div>
    </section>
  );
}

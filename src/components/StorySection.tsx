"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/menu-data";
import { revealOnScroll } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(
        ".story-reveal",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      revealOnScroll(
        ".story-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="story" ref={sectionRef} className="relative bg-ink py-28 md:py-40">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-10">
        <p className="story-reveal section-kicker text-lg md:text-xl">
          A Franklin Square Story
        </p>

        <h2 className="story-reveal mt-4 font-display text-3xl font-bold uppercase leading-tight text-cream md:text-5xl">
          From {siteConfig.story.heritageName}
          <br />
          to {siteConfig.displayName}
        </h2>

        <div className="story-line story-reveal mx-auto mt-8 h-px w-24 origin-center bg-gold" />

        <p className="story-reveal mt-10 font-sans text-base leading-loose text-parchment md:text-lg">
          {siteConfig.story.description}
        </p>

        <p className="story-reveal mt-8 font-script text-2xl italic text-gold-bright md:text-3xl">
          Same corner. Same warmth. New fire.
        </p>
      </div>
    </section>
  );
}

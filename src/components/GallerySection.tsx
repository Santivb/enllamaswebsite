"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { featuredDishes } from "@/lib/menu-data";
import { revealOnScroll } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(
        ".dish-card",
        { opacity: 0, y: 36, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker text-lg md:text-xl">Fan Favorites</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-cream md:text-5xl">
            Signature Dishes
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {featuredDishes.map((dish) => (
            <div
              key={dish.name}
              className="dish-card group aspect-[4/5] rounded-sm"
            >
              {dish.image && (
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              <div className="relative z-10 flex h-full flex-col justify-end p-5 md:p-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-bright">
                  {dish.tag}
                </span>
                <h3 className="mt-2 font-display text-xl leading-snug text-cream md:text-2xl">
                  {dish.name}
                </h3>
                <p className="mt-1 font-sans text-xs text-parchment/80 md:text-sm">
                  {dish.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center font-sans text-xs uppercase tracking-[0.2em] text-gold-bright transition-colors hover:text-gold"
          >
            View Full Menu &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

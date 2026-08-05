"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menuCategories } from "@/lib/menu-data";
import { revealOnScroll } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function MenuSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = gsap.utils.toArray<HTMLElement>(".menu-category");
      blocks.forEach((block) => {
        revealOnScroll(
          block,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink pb-24">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <div className="flex flex-col gap-16 md:gap-20">
          {menuCategories.map((category) => (
            <div key={category.id} className="menu-category">
              <div className="flex items-center gap-4">
                <span className="divider-line flex-1" />
                <h3 className="section-heading whitespace-nowrap text-xl md:text-2xl">
                  {category.title}
                </h3>
                <span className="divider-line flex-1" />
              </div>

              {category.note && (
                <p className="mt-3 text-center font-sans text-xs uppercase tracking-[0.15em] text-gold-bright/80 md:text-sm">
                  {category.note}
                </p>
              )}

              {category.items && (
                <div className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="border-b border-line/60 pb-4"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <h4 className="font-display text-lg text-gold-bright md:text-xl">
                          {item.name}
                        </h4>
                        {item.price && (
                          <span className="whitespace-nowrap font-display text-base text-gold md:text-lg">
                            {item.price}
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="mt-1 font-sans text-sm text-gold/60">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {category.variantGroups && (
                <div className="mt-6 space-y-4">
                  {category.variantGroups.map((group) => (
                    <p
                      key={group.items.join("-")}
                      className="text-center font-display text-base tracking-wide text-gold md:text-lg"
                    >
                      {group.items.map((v, i) => (
                        <span key={v}>
                          {v}
                          {i < group.items.length - 1 && (
                            <span className="mx-3 text-gold/40">•</span>
                          )}
                        </span>
                      ))}
                      <span className="ml-4 text-sm text-gold-bright md:text-base">
                        {group.price}
                      </span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

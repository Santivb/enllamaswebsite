"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/menu-data";
import { revealOnScroll } from "@/lib/motion";
import ServiceHours from "./ServiceHours";
import PhoneLinks from "./PhoneLinks";
import MapEmbed from "./MapEmbed";

gsap.registerPlugin(ScrollTrigger);


export default function VisitSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      revealOnScroll(
        ".visit-reveal",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="visit" ref={sectionRef} className="ember-field relative py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <div>
          <p className="visit-reveal section-kicker text-lg md:text-xl">
            Join Us
          </p>
          <h2 className="visit-reveal mt-3 font-display text-4xl font-bold uppercase text-cream md:text-5xl">
            Visit {siteConfig.displayName}
          </h2>

          <div className="visit-reveal mt-10 space-y-8">
            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Address
              </h3>
              <p className="mt-2 font-display text-lg text-cream">
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.line2}
              </p>
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Phone
              </h3>
              <PhoneLinks className="mt-2 font-sans text-sm text-cream" />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Hours
              </h3>
              <ServiceHours className="mt-2 max-w-xs" />
            </div>

            <div>
              <h3 className="text-xs uppercase tracking-[0.25em] text-gold">
                Bulk Orders
              </h3>
              <p className="mt-2 font-sans text-sm text-muted">
                Need more of what&rsquo;s on the menu?{" "}
                <a href="/bulk-orders" className="text-gold-bright hover:underline">
                  Request a quote
                </a>
                . 1 week notice preferred.
              </p>
            </div>
          </div>

          <div className="visit-reveal mt-10 flex flex-wrap gap-4">
            <a
              href={siteConfig.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-gold px-6 py-3 font-sans text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-bright"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="visit-reveal relative aspect-square overflow-hidden rounded-sm border border-line md:aspect-auto">
          <MapEmbed
            query={siteConfig.address.full}
            directionsUrl={siteConfig.googleMapsUrl}
            className="h-full min-h-[360px] w-full grayscale-[40%] contrast-125 invert-[0.92]"
          />
        </div>
      </div>
    </section>
  );
}

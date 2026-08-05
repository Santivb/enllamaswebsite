"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * The brand centerpiece: a plain, always-fully-visible image (no WebGL
 * texture/geometry involved, so it can never crop, fail to load, or mismatch
 * a 3D mesh). Parallax tilt is applied on an outer wrapper; the continuous
 * idle float/rotate is a separate CSS animation on an inner wrapper, so the
 * two motions don't fight over the same `transform`.
 */
export default function LogoEmblem() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const springX = useSpring(px, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(py, { stiffness: 60, damping: 18, mass: 0.6 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex h-full w-full items-center justify-center"
      style={{ perspective: 900 }}
    >
      {/*
        Always pass the same style shape on server and client — conditioning
        it on prefers-reduced-motion caused a hydration mismatch, since that
        media query can't be evaluated during SSR. Reduced motion is instead
        enforced by never updating px/py in handlePointerMove above, which
        keeps rotateX/rotateY resolved at their neutral (0deg) value.
      */}
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div
          aria-hidden="true"
          className="emblem-glow absolute inset-0 m-auto aspect-square w-[80%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, var(--color-flame-gold) 0%, transparent 75%)",
          }}
        />

        <div className="emblem-float relative aspect-square w-[92%]">
          <Image
            src="/assets/logo/en-llamas-87-master.png"
            alt="En Llamas 87"
            fill
            priority
            sizes="(max-width: 768px) 75vw, 540px"
            className="object-contain drop-shadow-[0_18px_50px_rgba(0,0,0,0.6)]"
          />
        </div>
      </motion.div>
    </div>
  );
}

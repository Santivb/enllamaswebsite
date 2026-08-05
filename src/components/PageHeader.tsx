"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  kicker: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function PageHeader({ kicker, title, description, children }: Props) {
  return (
    <section className="ember-field relative pt-40 pb-20 md:pt-48 md:pb-24">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="section-kicker text-lg md:text-xl"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-cream md:text-6xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-5 font-sans text-sm leading-relaxed text-parchment md:text-base"
          >
            {description}
          </motion.p>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8"
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

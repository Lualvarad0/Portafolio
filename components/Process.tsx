"use client";

import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Array<{ num: string; label: string; desc: string }>;
  const lineRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(lineRef, { once: true, margin: "-100px" });

  return (
    <section
      id="process"
      className="py-24 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--bg2)" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p
            className="text-xs font-mono font-semibold tracking-widest uppercase mb-3"
            style={{ color: "var(--accent)" }}
          >
            PROCESS
          </p>
          <h2
            className="text-5xl md:text-6xl font-display font-black uppercase mb-4"
            style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg max-w-lg" style={{ color: "var(--muted)" }}>
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Horizontal connector line */}
          <div
            ref={lineRef}
            className="hidden md:block absolute top-8 left-0 right-0 h-px mx-4"
            style={{ background: "var(--border)" }}
          >
            <motion.div
              className="h-full"
              style={{ background: "var(--accent)", transformOrigin: "left" }}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative text-center md:text-left"
              >
                {/* Circle */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 relative z-10"
                  style={{
                    background: "var(--bg3)",
                    border: "2px solid var(--accent)",
                  }}
                >
                  <span
                    className="text-xs font-mono font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3
                  className="text-base font-display font-bold mb-2"
                  style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
                >
                  {step.label}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface TestimonialCardProps {
  text: string;
  author: string;
  delay: number;
}

function TestimonialCard({ text, author, delay }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl p-8 flex flex-col"
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      <svg
        width="28"
        height="22"
        viewBox="0 0 28 22"
        fill="none"
        aria-hidden="true"
        className="mb-5 shrink-0"
      >
        <path
          d="M0 22V13.455C0 9.712 1.197 6.59 3.59 4.09 5.984 1.59 9.197.227 13.23 0l.91 1.637c-3.136.545-5.53 1.773-7.182 3.682C5.304 7.227 4.45 9.5 4.394 12.136H8.68V22H0zm14.77 0V13.455c0-3.743 1.197-6.865 3.59-9.365C20.755 1.59 23.97.227 28 0l.91 1.637c-3.136.545-5.53 1.773-7.182 3.682-1.654 1.908-2.508 4.181-2.564 6.817H23.45V22h-8.68z"
          fill="var(--accent)"
          fillOpacity="0.25"
        />
      </svg>
      <p className="text-sm md:text-base leading-relaxed mb-6 flex-1" style={{ color: "#374151" }}>
        {text}
      </p>
      <div
        className="text-xs font-mono font-semibold tracking-widest uppercase"
        style={{ color: "var(--muted)" }}
      >
        — {author}
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");

  const testimonials = [
    { key: "t1", text: t("t1.text"), author: t("t1.author") },
    { key: "t2", text: t("t2.text"), author: t("t2.author") },
    { key: "t3", text: t("t3.text"), author: t("t3.author") },
  ];

  return (
    <section
      id="testimonials"
      className="py-24 px-6 md:px-12 lg:px-24"
      style={{ background: "#f4f4f6" }}
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
            TESTIMONIALS
          </p>
          <h2
            className="text-5xl md:text-6xl font-display font-black uppercase mb-4"
            style={{ color: "#0b0d12", fontFamily: "var(--font-barlow)" }}
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg max-w-xl" style={{ color: "#5a6478" }}>
            {t("subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ key, text, author }, i) => (
            <TestimonialCard key={key} text={text} author={author} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

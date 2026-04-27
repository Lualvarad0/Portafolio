"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

interface ServiceCardProps {
  num: string;
  name: string;
  desc: string;
  tags: string[];
  security?: boolean;
  delay: number;
}

function ServiceCard({ num, name, desc, tags, security = false, delay }: ServiceCardProps) {
  const accentColor = security ? "var(--red)" : "var(--accent)";
  const bgAccent = security ? "rgba(244,63,94,0.08)" : "rgba(34,211,238,0.06)";
  const borderColor = security ? "rgba(244,63,94,0.2)" : "var(--border)";
  const hoverBorder = security ? "rgba(244,63,94,0.5)" : "rgba(34,211,238,0.4)";

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      custom={delay}
      variants={fadeUp}
      className="rounded-xl p-6 transition-all duration-300 group"
      style={{
        background: "var(--bg3)",
        border: `1px solid ${borderColor}`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = hoverBorder;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = borderColor;
      }}
    >
      <div className="flex items-start gap-4 mb-4">
        <span
          className="flex items-center justify-center w-10 h-10 rounded-lg text-xs font-mono font-bold shrink-0"
          style={{ background: bgAccent, color: accentColor }}
        >
          {num}
        </span>
        <h3
          className="text-lg font-display font-bold leading-tight pt-1.5"
          style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
        >
          {name}
        </h3>
      </div>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>
        {desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{
              color: accentColor,
              background: bgAccent,
              border: `1px solid ${borderColor}`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function Services() {
  const t = useTranslations("services");

  const services = [
    { key: "s1", security: false },
    { key: "s2", security: false },
    { key: "s3", security: false },
    { key: "s4", security: true },
    { key: "s5", security: true },
  ] as const;

  return (
    <section
      id="services"
      className="py-24 px-6 md:px-12 lg:px-24"
      style={{ background: "#ffffff" }}
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
            SERVICES
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

        {/* Row 1: 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {services.slice(0, 3).map(({ key, security }, i) => (
            <ServiceCard
              key={key}
              num={`0${i + 1}`}
              name={t(`${key}.name` as `s1.name`)}
              desc={t(`${key}.desc` as `s1.desc`)}
              tags={t.raw(`${key}.tags` as `s1.tags`) as string[]}
              security={security}
              delay={i * 0.08}
            />
          ))}
        </div>

        {/* Row 2: 2 columns centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:max-w-3xl md:mx-auto">
          {services.slice(3).map(({ key, security }, i) => (
            <ServiceCard
              key={key}
              num={`0${i + 4}`}
              name={t(`${key}.name` as `s4.name`)}
              desc={t(`${key}.desc` as `s4.desc`)}
              tags={t.raw(`${key}.tags` as `s4.tags`) as string[]}
              security={security}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

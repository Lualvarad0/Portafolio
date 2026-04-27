"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface SecurityCardProps {
  name: string;
  lang: string;
  tags: string[];
  delay: number;
}

function SecurityCard({ name, lang, tags, delay }: SecurityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="rounded-xl p-6 transition-all duration-300"
      style={{
        background: "var(--bg3)",
        border: "1px solid rgba(244,63,94,0.2)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(244,63,94,0.5)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(244,63,94,0.2)";
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--red)" }}
            aria-hidden="true"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h3
            className="text-base font-display font-bold"
            style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
          >
            {name}
          </h3>
          <span
            className="text-xs font-mono tracking-widest"
            style={{ color: "var(--red)" }}
          >
            {lang}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{
              color: "var(--red)",
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.15)",
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SecurityLabs() {
  const t = useTranslations("security");

  const cards = [
    {
      key: "card1",
      name: t("card1.name"),
      lang: t("card1.lang"),
      tags: t.raw("card1.tags") as string[],
    },
    {
      key: "card2",
      name: t("card2.name"),
      lang: t("card2.lang"),
      tags: t.raw("card2.tags") as string[],
    },
    {
      key: "card3",
      name: t("card3.name"),
      lang: t("card3.lang"),
      tags: t.raw("card3.tags") as string[],
    },
  ];

  return (
    <section
      id="security"
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
            style={{ color: "var(--red)" }}
          >
            SECURITY
          </p>
          <h2
            className="text-5xl md:text-6xl font-display font-black uppercase mb-4"
            style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
          >
            {t("title")}
          </h2>
          <p className="text-base md:text-lg max-w-xl" style={{ color: "var(--muted)" }}>
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {cards.map((card, i) => (
            <SecurityCard
              key={card.key}
              name={card.name}
              lang={card.lang}
              tags={card.tags}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: "var(--red)" }}
        >
          <div>
            <h3
              className="text-2xl md:text-3xl font-display font-black mb-2"
              style={{ color: "#fff", fontFamily: "var(--font-barlow)" }}
            >
              {t("cta.title")}
            </h3>
            <p className="text-sm md:text-base opacity-90" style={{ color: "rgba(255,255,255,0.85)" }}>
              {t("cta.desc")}
            </p>
          </div>
          <button
            onClick={() => {
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="shrink-0 font-mono font-bold text-sm px-8 py-3 rounded transition-all duration-200"
            style={{
              background: "#fff",
              color: "var(--red)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#0b0d12";
              (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
              (e.currentTarget as HTMLButtonElement).style.color = "var(--red)";
            }}
          >
            {t("cta.btn")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

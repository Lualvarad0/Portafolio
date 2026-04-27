"use client";

import { useTranslations } from "next-intl";
import { motion, type Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { CONFIG } from "@/lib/config";

const Terminal = dynamic(() => import("./Terminal"), { ssr: false });

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  }),
};

interface HeroProps {
  repoCount: number;
}

export default function Hero({ repoCount }: HeroProps) {
  const t = useTranslations("hero");
  const tStats = useTranslations("stats");

  const stats = [
    { value: repoCount > 0 ? `${repoCount}+` : "10+", label: tStats("repos") },
    { value: "5+", label: tStats("years") },
    { value: "✓", label: tStats("security") },
    { value: "☁", label: tStats("cloud") },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-[96px] pb-16 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Text column */}
        <div>
          <motion.div
            initial="hidden"
            animate="show"
            custom={0}
            variants={fadeUp}
          >
            <span
              className="inline-block text-xs font-mono font-semibold tracking-widest uppercase mb-6 px-3 py-1.5 rounded"
              style={{
                color: "var(--accent)",
                background: "rgba(34,211,238,0.08)",
                border: "1px solid var(--border)",
              }}
            >
              {t("tag")}
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="show"
            custom={0.1}
            variants={fadeUp}
            className="text-7xl md:text-8xl xl:text-9xl font-display font-black uppercase leading-none mb-6"
            style={{ fontFamily: "var(--font-barlow)", color: "var(--text)" }}
          >
            {t("name1")}
            <br />
            <em
              className="not-italic"
              style={{ color: "var(--accent)", fontStyle: "italic" }}
            >
              {t("name2")}
            </em>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="show"
            custom={0.2}
            variants={fadeUp}
            className="text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            style={{ color: "var(--muted)" }}
          >
            {t("sub")}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="show"
            custom={0.3}
            variants={fadeUp}
            className="flex flex-wrap gap-3 mb-12"
          >
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono font-bold text-sm px-6 py-3 rounded transition-all duration-200"
              style={{ background: "var(--accent)", color: "#0b0d12" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent2)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")
              }
            >
              {t("cta1")}
            </a>
            <a
              href={`https://github.com/${CONFIG.github.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono font-bold text-sm px-6 py-3 rounded border transition-all duration-200"
              style={{
                color: "var(--text)",
                borderColor: "var(--border)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
              }}
            >
              {t("cta2")}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="show"
            custom={0.4}
            variants={fadeUp}
            className="grid grid-cols-4 gap-4 pt-8"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl font-display font-black"
                  style={{
                    color: "var(--accent)",
                    fontFamily: "var(--font-barlow)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs font-mono mt-1 leading-tight"
                  style={{ color: "var(--muted)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Terminal column */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="hidden lg:block"
        >
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
}

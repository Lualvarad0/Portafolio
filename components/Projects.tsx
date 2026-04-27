"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { projects } from "@/lib/projects";
import { CONFIG } from "@/lib/config";

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  PHP: "#777bb4",
  "C#": "#9b4f96",
  Java: "#ed8b00",
  Python: "#3572A5",
  HTML: "#e34c26",
  Markdown: "#5a6478",
};

interface ProjectCardProps {
  name: string;
  description: string | null;
  language: string;
  stack: string;
  url: string;
  viewCode: string;
  delay: number;
}

function ProjectCard({
  name,
  description,
  language,
  stack,
  url,
  viewCode,
  delay,
}: ProjectCardProps) {
  const langColor = LANG_COLORS[language] ?? "var(--accent)";

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${name} on GitHub`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="flex flex-col rounded-xl p-6 group transition-all duration-300"
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "rgba(34,211,238,0.4)";
        (e.currentTarget as HTMLAnchorElement).style.transform =
          "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor =
          "var(--border)";
        (e.currentTarget as HTMLAnchorElement).style.transform =
          "translateY(0)";
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "rgba(34,211,238,0.08)",
            border: "1px solid var(--border)",
          }}
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
            style={{ color: "var(--accent)" }}
            aria-hidden="true"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </div>
        <span
          className="text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "var(--accent)" }}
        >
          {viewCode} →
        </span>
      </div>

      {/* Name */}
      <h3
        className="text-base font-display font-bold mb-2 leading-tight"
        style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
      >
        {name}
      </h3>

      {/* Description (if available) */}
      {description ? (
        <p
          className="text-xs leading-relaxed mb-3 flex-1"
          style={{ color: "var(--muted)" }}
        >
          {description}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      {/* Stack */}
      <p
        className="text-xs font-mono mb-4"
        style={{ color: "rgba(34,211,238,0.6)" }}
      >
        {stack}
      </p>

      {/* Language dot */}
      <div className="flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: langColor }}
          aria-hidden="true"
        />
        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
          {language}
        </span>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const t = useTranslations("projects");

  return (
    <section
      id="projects"
      className="py-24 px-6 md:px-12 lg:px-24"
      style={{ background: "var(--bg)" }}
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
            PROJECTS
          </p>
          <h2
            className="text-5xl md:text-6xl font-display font-black uppercase mb-4"
            style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
          >
            {t("title")}
          </h2>
          <p
            className="text-base md:text-lg max-w-xl"
            style={{ color: "var(--muted)" }}
          >
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              name={project.name}
              description={project.description}
              language={project.language}
              stack={project.stack}
              url={project.url}
              viewCode={t("viewCode")}
              delay={i * 0.08}
            />
          ))}

          {/* More on GitHub card */}
          <motion.a
            href={`https://github.com/${CONFIG.github.username}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View all projects on GitHub"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: projects.length * 0.08 }}
            className="rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[180px]"
            style={{
              background: "var(--bg3)",
              border: "1px dashed var(--border)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "var(--accent)";
              (e.currentTarget as HTMLAnchorElement).style.background =
                "rgba(34,211,238,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "var(--border)";
              (e.currentTarget as HTMLAnchorElement).style.background =
                "var(--bg3)";
            }}
          >
            <span className="text-2xl mb-3" aria-hidden="true">
              →
            </span>
            <span
              className="text-sm font-mono font-semibold tracking-widest"
              style={{ color: "var(--accent)" }}
            >
              {t("more")}
            </span>
          </motion.a>
        </div>
      </div>
    </section>
  );
}

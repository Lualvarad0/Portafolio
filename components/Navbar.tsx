"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { key: "services", href: "#services" },
  { key: "projects", href: "#projects" },
  { key: "security", href: "#security" },
  { key: "contact", href: "#contact" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLocale = () => {
    const next = locale === "en" ? "es" : "en";
    router.replace(pathname, { locale: next });
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center px-6 md:px-12 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(11,13,18,0.98)"
            : "rgba(11,13,18,0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid var(--border)" : "none",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.4)" : "none",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-mono text-lg font-bold tracking-tight select-none"
          style={{ fontFamily: "var(--font-jetbrains)" }}
        >
          <span style={{ color: "var(--accent)" }}>•</span>{" "}
          <span style={{ color: "var(--text)" }}>da.dev</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 mx-auto">
          {navLinks.map(({ key, href }) => (
            <button
              key={key}
              onClick={() => scrollTo(href)}
              aria-label={locale === "es" ? `Ir a sección ${t(key as keyof typeof t)}` : `Go to ${t(key as keyof typeof t)} section`}
              className="relative text-sm font-mono tracking-widest uppercase transition-colors group"
              style={{ color: "var(--muted)" }}
            >
              <span className="group-hover:text-white transition-colors duration-200">
                {t(key as keyof typeof t)}
              </span>
              <span
                className="absolute -bottom-0.5 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-300"
                style={{ background: "var(--accent)" }}
              />
            </button>
          ))}
        </div>

        {/* Right: lang toggle + CTA */}
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={toggleLocale}
            aria-label={`Switch to ${locale === "en" ? "Spanish" : "English"}`}
            className="hidden md:flex items-center text-xs font-mono font-semibold tracking-widest px-3 py-1.5 rounded border transition-all duration-200"
            style={{
              color: "var(--accent)",
              borderColor: "var(--border)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(34,211,238,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--border)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            {locale === "en" ? "ES" : "EN"}
          </button>

          <button
            onClick={() => scrollTo("#contact")}
            className="hidden md:flex text-xs font-mono font-bold tracking-widest uppercase px-4 py-2 rounded transition-all duration-200"
            style={{ background: "var(--accent)", color: "#0b0d12" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
            }}
          >
            {t("hire")}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className="block h-0.5 w-5 transition-all duration-300"
              style={{
                background: "var(--text)",
                transform: mobileOpen
                  ? "rotate(45deg) translate(4px,4px)"
                  : "none",
              }}
            />
            <span
              className="block h-0.5 w-5 transition-all duration-300"
              style={{
                background: "var(--text)",
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-0.5 w-5 transition-all duration-300"
              style={{
                background: "var(--text)",
                transform: mobileOpen
                  ? "rotate(-45deg) translate(4px,-4px)"
                  : "none",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col pt-[60px]"
            style={{ background: "rgba(11,13,18,0.98)", backdropFilter: "blur(20px)" }}
          >
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
              {navLinks.map(({ key, href }) => (
                <button
                  key={key}
                  onClick={() => scrollTo(href)}
                  className="text-2xl font-display font-bold uppercase tracking-widest"
                  style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
                >
                  {t(key as keyof typeof t)}
                </button>
              ))}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={toggleLocale}
                  className="text-sm font-mono px-4 py-2 rounded border"
                  style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
                >
                  {locale === "en" ? "ES" : "EN"}
                </button>
                <button
                  onClick={() => scrollTo("#contact")}
                  className="text-sm font-mono font-bold px-6 py-2 rounded"
                  style={{ background: "var(--accent)", color: "#0b0d12" }}
                >
                  {t("hire")}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

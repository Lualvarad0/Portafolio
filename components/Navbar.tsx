"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { getPathname, usePathname, useRouter } from "@/i18n/navigation";
import { LogoLockup } from "./Logo";

const SECTIONS = [
  { key: "services", id: "servicios" },
  { key: "development", id: "desarrollo" },
  { key: "data", id: "datos" },
  { key: "security", id: "seguridad" },
  { key: "projects", id: "proyectos" },
] as const;

/**
 * @param overHero  true on the home page: transparent over the hero video until the
 *                  visitor scrolls past it. Other pages get the solid bar straight away.
 */
export default function Navbar({ overHero = false }: { overHero?: boolean }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(!overHero);
  const [active, setActive] = useState<string | null>(null);

  // Same-page anchors on home; full links back to home from other pages.
  const home = getPathname({ href: "/", locale });
  const href = (id: string) => (pathname === "/" ? `#${id}` : `${home}#${id}`);

  useEffect(() => {
    if (!overHero) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overHero]);

  // Scroll-spy: highlight the section currently in the middle of the viewport.
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const toggleLocale = () => router.replace(pathname, { locale: locale === "es" ? "en" : "es" });

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] flex items-center justify-between p-4 transition-colors duration-300 sm:p-5 ${
        scrolled || menuOpen ? "bg-ink/85 backdrop-blur-xl" : ""
      }`}
    >
      <a href={pathname === "/" ? "#" : home} className="flex items-center gap-2.5" aria-label={t("home")}>
        <LogoLockup size={22} color="#ffffff" />
      </a>

      <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/30 bg-white/15 px-2 py-2 backdrop-blur-md xl:flex">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={href(s.id)}
            aria-current={active === s.id ? "true" : undefined}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === s.id ? "bg-white/25 text-white" : "text-white/85 hover:bg-white/20 hover:text-white"
            }`}
          >
            {t(s.key)}
          </a>
        ))}
      </div>

      <div className="hidden items-center gap-2 xl:flex">
        <button
          type="button"
          onClick={toggleLocale}
          aria-label={t("switchLocale")}
          className="rounded-full border border-white/30 px-3.5 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/15"
        >
          {locale === "es" ? "EN" : "ES"}
        </button>
        <a
          href={href("contacto")}
          className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100"
        >
          {t("contact")}
        </a>
      </div>

      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md xl:hidden"
        onClick={() => setMenuOpen((o) => !o)}
        aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
      >
        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute left-4 right-4 top-[68px] flex flex-col gap-1 rounded-3xl border border-white/20 bg-black/85 p-3 backdrop-blur-xl xl:hidden"
        >
          {SECTIONS.map((s) => (
            <a
              key={s.id}
              href={href(s.id)}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-white/90 hover:bg-white/10"
            >
              {t(s.key)}
            </a>
          ))}
          <div className="mt-1 grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t("switchLocale")}
              className="rounded-2xl border border-white/25 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white"
            >
              {locale === "es" ? "EN" : "ES"}
            </button>
            <a
              href={href("contacto")}
              onClick={() => setMenuOpen(false)}
              className="rounded-2xl bg-white px-4 py-3 text-center text-base font-semibold text-neutral-900"
            >
              {t("contact")}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

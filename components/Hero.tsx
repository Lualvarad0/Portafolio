"use client";

import { useEffect, useRef, type CSSProperties, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { CodeCanvas, LayerVideo, NetworkCanvas } from "./Backdrops";
import { LogoMark } from "./Logo";
import { BRAND, VIDEOS } from "@/lib/brand";

const SPOTLIGHT_R = 260;

/* Revealed layer: radial mask that follows the cursor.
   Opacity curve: 0→1, .4→1, .6→.75, .75→.4, .88→.12, 1→0 */
function RevealLayer({ maskRef }: { maskRef: RefObject<HTMLDivElement | null> }) {
  const mask = `radial-gradient(circle ${SPOTLIGHT_R}px at var(--x) var(--y),
    rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,.75) 60%,
    rgba(255,255,255,.4) 75%, rgba(255,255,255,.12) 88%, rgba(255,255,255,0) 100%)`;
  return (
    <div
      ref={maskRef}
      className="pointer-events-none absolute inset-0 z-30"
      style={
        {
          "--x": "-999px",
          "--y": "-999px",
          maskImage: mask,
          WebkitMaskImage: mask,
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        } as CSSProperties
      }
    >
      <LayerVideo src={VIDEOS.reveal} fallback={<CodeCanvas />} />
      {/* slight brand tint so the revealed area reads as "another layer" */}
      <div className="absolute inset-0 bg-signal/[0.06] mix-blend-screen" />
    </div>
  );
}

export default function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mouse = { x: -999, y: -999, last: 0 };
    const smooth = { x: -999, y: -999 };
    let raf = 0;

    const place = (x: number, y: number) => {
      maskRef.current?.style.setProperty("--x", `${x}px`);
      maskRef.current?.style.setProperty("--y", `${y}px`);
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = section.getBoundingClientRect();
      place(r.width * 0.72, r.height * 0.5);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.last = performance.now();
    };

    const tick = (time: number) => {
      const r = section.getBoundingClientRect();
      // Off-screen: skip the work but keep the loop alive cheaply.
      if (r.bottom > 0) {
        // No cursor (touch) or idle for 2.5 s: the spotlight wanders on its own.
        const idle = time - mouse.last > 2500;
        const target = idle
          ? { x: r.width * (0.5 + 0.3 * Math.sin(time * 0.00035)), y: r.height * (0.55 + 0.18 * Math.sin(time * 0.0006)) }
          : mouse;
        if (smooth.x < -500) Object.assign(smooth, { x: target.x, y: target.y });
        smooth.x += (target.x - smooth.x) * 0.1;
        smooth.y += (target.y - smooth.y) * 0.1;
        place(smooth.x, smooth.y);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100dvh", minHeight: 560 }}
    >
      {/* 1. Base layer */}
      <div className="hero-zoom absolute inset-0 z-10">
        <LayerVideo src={VIDEOS.base} fallback={<NetworkCanvas />} />
      </div>
      {/* veil so the text reads over the video */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-black/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

      {/* 2. Revealed layer (the code behind) */}
      <RevealLayer maskRef={maskRef} />

      {/* on mobile, darken the base so the bottom text reads over the code */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[45] h-[42%] bg-gradient-to-t from-black via-black/85 to-transparent sm:hidden" />

      {/* ring marking the spotlight */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 z-40 hidden sm:block"
        style={{ transform: "translate3d(-999px,-999px,0)" }}
        aria-hidden="true"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
          style={{ width: SPOTLIGHT_R * 1.5, height: SPOTLIGHT_R * 1.5 }}
        />
        <span
          className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-white/50"
          style={{ transform: `translate(-50%, ${SPOTLIGHT_R * 0.75 + 10}px)` }}
        >
          {t("codeBehind")}
        </span>
      </div>

      {/* 3. Headline */}
      <div className="pointer-events-none absolute left-0 right-0 top-[15%] z-50 flex flex-col items-center px-5 text-center">
        <p
          className="hero-anim hero-fade mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/85 backdrop-blur-md sm:text-xs"
          style={{ animationDelay: "0.1s" }}
        >
          <LogoMark size={11} color="#ffffff" />
          {BRAND}
          <span className="hidden sm:inline"> · {t("city")}</span>
        </p>
        <h1 className="leading-[0.95] text-white">
          <span
            className="hero-anim hero-reveal font-playfair block text-5xl font-normal sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
          >
            {t("title1")}
          </span>
          <span
            className="hero-anim hero-reveal -mt-1 block text-5xl font-normal sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
          >
            {t("title2")}
          </span>
        </h1>
      </div>

      {/* 4. Bottom-left paragraph */}
      <div
        className="hero-anim hero-fade absolute bottom-14 left-10 z-50 hidden max-w-[280px] sm:block md:left-14"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-signal">{t("kicker")}</p>
        <p className="text-sm leading-relaxed text-white/80">{t("lead")}</p>
      </div>

      {/* 5. Bottom-right block */}
      <div
        className="hero-anim hero-fade absolute bottom-10 left-5 right-5 z-50 flex max-w-full flex-col items-start gap-4 sm:bottom-24 sm:left-auto sm:right-10 sm:max-w-[280px] sm:gap-5 md:right-14"
        style={{ animationDelay: "0.85s" }}
      >
        <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{t("side")}</p>
        <a
          href="#contacto"
          className="group inline-flex items-center gap-2 rounded-full bg-signal px-7 py-3 text-sm font-semibold text-ink transition-all hover:scale-[1.03] hover:bg-signal-dark hover:shadow-lg hover:shadow-signal/30 active:scale-95"
        >
          {t("cta")}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </section>
  );
}

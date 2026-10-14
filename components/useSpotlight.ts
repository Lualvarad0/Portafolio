"use client";

import { useEffect, type RefObject } from "react";

/** CSS mask for the revealed layer. Opacity curve: 0→1, .4→1, .6→.75, .75→.4, .88→.12, 1→0 */
export const spotlightMask = (radius: number) =>
  `radial-gradient(circle ${radius}px at var(--x) var(--y),
    rgba(255,255,255,1) 0%, rgba(255,255,255,1) 40%, rgba(255,255,255,.75) 60%,
    rgba(255,255,255,.4) 75%, rgba(255,255,255,.12) 88%, rgba(255,255,255,0) 100%)`;

/**
 * Cursor-following spotlight shared by the hero and the security scope.
 * Writes --x/--y on the mask element and moves the ring with lerp smoothing (0.1).
 * With no cursor (touch) or after 2.5 s idle, the spotlight wanders on its own.
 * Pauses while the container is off-screen; static under reduced motion.
 */
export function useSpotlight(
  containerRef: RefObject<HTMLElement | null>,
  maskRef: RefObject<HTMLElement | null>,
  ringRef: RefObject<HTMLElement | null>,
  rest: { x: number; y: number } = { x: 0.72, y: 0.5 }
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const mouse = { x: -999, y: -999, last: 0 };
    const smooth = { x: -999, y: -999 };
    let raf = 0;
    let visible = true;

    const place = (x: number, y: number) => {
      maskRef.current?.style.setProperty("--x", `${x}px`);
      maskRef.current?.style.setProperty("--y", `${y}px`);
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = container.getBoundingClientRect();
      place(r.width * rest.x, r.height * rest.y);
      return;
    }

    const onMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      // Only follow the cursor while it's over (or near) this container.
      if (e.clientY < r.top - 80 || e.clientY > r.bottom + 80) return;
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.last = performance.now();
    };

    const tick = (time: number) => {
      if (visible) {
        const r = container.getBoundingClientRect();
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

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(container);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

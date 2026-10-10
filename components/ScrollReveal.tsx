"use client";

import { useEffect } from "react";

/**
 * Fades in [data-reveal] elements as they scroll into view. Only elements still
 * below the fold are hidden, so content is visible without JS and on first paint.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("reveal-wait");
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);

  return null;
}

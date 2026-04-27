"use client";

import { useTranslations } from "next-intl";

export default function AvailabilityBar() {
  const t = useTranslations();

  const text = t("avail");
  const repeated = Array(6).fill(text).join("  ·  ");

  return (
    <div
      className="sticky top-[60px] z-40 h-9 flex items-center overflow-hidden"
      style={{ background: "var(--accent)", color: "#0b0d12" }}
    >
      <div className="flex items-center gap-3 shrink-0 px-4">
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse-dot"
          style={{ background: "#00ff88" }}
          aria-hidden="true"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <div
          className="flex whitespace-nowrap animate-marquee"
          aria-label={text}
        >
          <span className="text-xs font-mono font-bold tracking-widest uppercase pr-12">
            {repeated}
          </span>
          <span
            className="text-xs font-mono font-bold tracking-widest uppercase pr-12"
            aria-hidden="true"
          >
            {repeated}
          </span>
        </div>
      </div>
    </div>
  );
}

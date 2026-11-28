"use client";

import type { ReactNode } from "react";
import { monoFamily, useCanvas } from "./Backdrops";
import { paintChrome, paintCode } from "./codePaint";
import { BLUE, GREEN, SIGNAL, reducedMotion } from "./touch";
import { DesktopScene, PhoneScene, type DesktopLabels, type PhoneLabels } from "./ServiceApps";

/*
 * Touch-only scene for each development service: a terminal types the real
 * commands of that kind of project and prints what they produce, in the same
 * editor style as the hero. Desktop keeps the plain icon.
 */
export type TerminalKind = "globe" | "phone" | "monitor" | "plug" | "cloud" | "wrench";
type Line = { k: "cmd" | "cont" | "out"; text: string };

const SCRIPTS: Record<TerminalKind, { title: string; lines: Line[] }> = {
  globe: {
    title: "erp-web — zsh",
    lines: [
      { k: "cmd", text: "npm run build" },
      { k: "out", text: "▲ Next.js 16 · compiling…" },
      { k: "out", text: "✓ Compiled successfully" },
      { k: "out", text: "✓ 24 pages generated" },
      { k: "cmd", text: "vercel deploy --prod" },
      { k: "out", text: "✓ erp.cliente.com is live" },
    ],
  },
  phone: {
    title: "pedidos-app — zsh",
    lines: [
      { k: "cmd", text: "flutter build apk --release" },
      { k: "out", text: "▶ Gradle assembleRelease…" },
      { k: "out", text: "✓ app-release.apk (18.4 MB)" },
      { k: "cmd", text: "adb install app-release.apk" },
      { k: "out", text: "✓ Success · offline sync on" },
    ],
  },
  monitor: {
    title: "caja — pwsh",
    lines: [
      { k: "cmd", text: "dotnet publish -r win-x64" },
      { k: "out", text: "▶ Caja → bin/publish/" },
      { k: "out", text: "✓ Caja.exe (self-contained)" },
      { k: "cmd", text: "caja --check-devices" },
      { k: "out", text: "✓ EPSON TM-T20 · printer ok" },
      { k: "out", text: "✓ Barcode scanner · ok" },
    ],
  },
  plug: {
    title: "api — zsh",
    lines: [
      { k: "cmd", text: "curl -X POST /api/pagos \\" },
      { k: "cont", text: "  -d '{\"monto\": 48.30}'" },
      { k: "out", text: "HTTP/1.1 200 OK" },
      { k: "out", text: "{ \"estado\": \"aprobado\" }" },
      { k: "out", text: "✓ webhook sent · mail queued" },
    ],
  },
  cloud: {
    title: "ci — zsh",
    lines: [
      { k: "cmd", text: "git push origin main" },
      { k: "out", text: "▶ build    ✓ 42s" },
      { k: "out", text: "▶ test     ✓ 128 passed" },
      { k: "out", text: "▶ docker   ✓ image pushed" },
      { k: "out", text: "✓ deployed to aws in 1m54s" },
    ],
  },
  wrench: {
    title: "ops — zsh",
    lines: [
      { k: "cmd", text: "tail -f /var/log/app.log" },
      { k: "out", text: "[INFO] GET /facturas 200 38ms" },
      { k: "out", text: "[WARN] slow query 2.4s" },
      { k: "out", text: "[FIX]  index ix_fecha created" },
      { k: "out", text: "[INFO] GET /facturas 200 12ms" },
    ],
  },
};

const CHAR_MS = 34;
const OUT_MS = 260;
const START = 400;
const HOLD = 2800;

function outColor(text: string) {
  if (text.startsWith("✓") || text.startsWith("[FIX]") || text.startsWith("HTTP")) return `rgb(${GREEN})`;
  if (text.startsWith("▶") || text.startsWith("▲") || text.startsWith("[WARN]")) return `rgb(${SIGNAL})`;
  if (text.startsWith("[INFO]")) return `rgba(${BLUE},0.85)`;
  return "rgba(230,239,233,0.7)";
}

function TerminalCanvas({ kind }: { kind: TerminalKind }) {
  const { title, lines } = SCRIPTS[kind];
  // when each line starts and finishes appearing
  const plan: { start: number; end: number }[] = [];
  let at = START;
  for (const l of lines) {
    const start = l.k === "out" ? at + OUT_MS : at + (l.k === "cmd" ? 500 : 120);
    const end = l.k === "out" ? start : start + l.text.length * CHAR_MS;
    plan.push({ start, end });
    at = end;
  }
  const cycle = at + HOLD;
  const longest = Math.max(...lines.map((l) => l.text.length + 2));

  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const t = reduced ? cycle - 1 : now % cycle;
    const mono = monoFamily();

    ctx.fillStyle = "#0b1210";
    ctx.fillRect(0, 0, w, h);
    paintChrome(ctx, w, title, `10px ${mono}`);

    const size = Math.max(8.5, Math.min(10.5, (w - 24) / (longest * 0.61)));
    const lh = size * 1.5;
    ctx.font = `${size}px ${mono}`;
    ctx.textBaseline = "middle";
    const fade = reduced ? 1 : Math.min(1, (cycle - t) / 400);

    let cursor: { x: number; y: number } | null = null;
    lines.forEach((l, i) => {
      const { start, end } = plan[i];
      if (t < start) return;
      const y = 38 + i * lh;
      ctx.globalAlpha = fade;
      if (l.k === "out") {
        ctx.globalAlpha = fade * Math.min(1, (t - start) / 180);
        ctx.fillStyle = outColor(l.text);
        ctx.fillText(l.text, 12, y);
      } else {
        const n = Math.min(l.text.length, Math.floor((t - start) / CHAR_MS));
        let x = 12;
        if (l.k === "cmd") {
          ctx.fillStyle = `rgb(${SIGNAL})`;
          ctx.fillText("$", x, y);
          x += ctx.measureText("$ ").width;
        } else {
          x += ctx.measureText("  ").width;
        }
        const endX = paintCode(ctx, l.text.slice(0, n), x, y, fade);
        if (t < end) cursor = { x: endX, y };
      }
    });
    // idle prompt with a blinking cursor once the script is done
    const last = plan[plan.length - 1];
    if (!cursor && t >= last.end) {
      const y = 38 + lines.length * lh;
      ctx.fillStyle = `rgba(${SIGNAL},${fade})`;
      ctx.fillText("$", 12, y);
      cursor = { x: 12 + ctx.measureText("$ ").width, y };
    }
    if (cursor && (reduced || Math.floor(now / 450) % 2 === 0)) {
      const c = cursor as { x: number; y: number };
      ctx.fillStyle = `rgba(${SIGNAL},${fade})`;
      ctx.fillRect(c.x + 1, c.y - size * 0.6, size * 0.55, size * 1.2);
    }
    ctx.globalAlpha = 1;
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

/**
 * Touch-only scene for a development service. Mobile apps and desktop show the
 * app itself working (for people who don't code); the rest, a terminal.
 */
export default function ServiceTerminal({
  kind,
  icon,
  phone,
  desktop,
}: {
  kind: TerminalKind;
  icon: ReactNode;
  phone: PhoneLabels;
  desktop: DesktopLabels;
}) {
  return (
    <div className="touch-only relative h-[150px] overflow-hidden rounded-2xl bg-[#0b1210] ring-1 ring-black/10" aria-hidden="true">
      {kind === "phone" ? <PhoneScene l={phone} /> : kind === "monitor" ? <DesktopScene l={desktop} /> : <TerminalCanvas kind={kind} />}
      <span className="absolute right-2.5 top-1.5 grid h-7 w-7 place-items-center rounded-lg bg-white/10 text-signal">
        {icon}
      </span>
    </div>
  );
}

"use client";

import { useRef, type CSSProperties } from "react";
import { monoFamily, useCanvas } from "./Backdrops";
import { spotlightMask, useSpotlight } from "./useSpotlight";

const SPOTLIGHT_R = 190;

/* ------------------------------------------------------------------ */
/* Base layer: a radar sweeping a network; vulnerable hosts flash red   */
/* ------------------------------------------------------------------ */
type Host = { x: number; y: number; vuln: boolean; port: string; hit: number };
const PORTS = [":22", ":80", ":443", ":3306", ":5432", ":8080", ":1433"];

function RadarCanvas() {
  const hosts = useRef<Host[]>([]);
  const ref = useCanvas((ctx, w, h, t) => {
    if (w === 0) return;
    if (hosts.current.length === 0) {
      const n = Math.round(Math.min(26, (w * h) / 16000));
      hosts.current = Array.from({ length: n }, (_, i) => ({
        x: 0.06 * w + Math.random() * 0.88 * w,
        y: 0.1 * h + Math.random() * 0.8 * h,
        vuln: i % 6 === 0,
        port: PORTS[i % PORTS.length],
        hit: -1e9,
      }));
    }
    const cx = w * 0.5;
    const cy = h * 0.5;
    const R = Math.hypot(w, h) * 0.55;

    ctx.fillStyle = "#050807";
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = "rgba(255,255,255,0.045)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // range rings
    ctx.strokeStyle = "rgba(242,194,48,0.10)";
    for (let k = 1; k <= 4; k++) {
      ctx.beginPath();
      ctx.arc(cx, cy, (R / 4) * k * 0.7, 0, Math.PI * 2);
      ctx.stroke();
    }

    // links between nearby hosts
    const hs = hosts.current;
    for (let i = 0; i < hs.length; i++)
      for (let j = i + 1; j < hs.length; j++) {
        const d = Math.hypot(hs[i].x - hs[j].x, hs[i].y - hs[j].y);
        if (d > 150) continue;
        ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 150) * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(hs[i].x, hs[i].y);
        ctx.lineTo(hs[j].x, hs[j].y);
        ctx.stroke();
      }

    // sweep: a wedge with a fading trail
    const angle = (t * 0.0009) % (Math.PI * 2);
    const trail = 0.9;
    for (let k = 0; k < 24; k++) {
      const a0 = angle - (trail * k) / 24;
      ctx.fillStyle = `rgba(242,194,48,${0.11 * (1 - k / 24)})`;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a0 - trail / 24, a0);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(242,194,48,0.55)";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
    ctx.stroke();

    // hosts: pinged when the sweep passes over them
    ctx.font = `10px ${monoFamily()}`;
    ctx.textBaseline = "middle";
    for (const p of hs) {
      const a = (Math.atan2(p.y - cy, p.x - cx) + Math.PI * 2) % (Math.PI * 2);
      const diff = (angle - a + Math.PI * 2) % (Math.PI * 2);
      if (diff < 0.05) p.hit = t;
      const age = (t - p.hit) / 1000; // seconds since last ping
      const glow = Math.max(0, 1 - age / 2.2);
      const color = p.vuln ? "255,77,77" : "61,220,151";

      if (glow > 0) {
        ctx.strokeStyle = `rgba(${color},${glow * 0.8})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 + (1 - glow) * 22, 0, Math.PI * 2);
        ctx.stroke();
        if (p.vuln) {
          ctx.fillStyle = `rgba(255,77,77,${glow})`;
          ctx.fillText(`${p.port} vuln`, p.x + 9, p.y - 10);
        }
      }
      ctx.fillStyle = glow > 0 ? `rgba(${color},${0.5 + glow * 0.5})` : "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.vuln ? 2.6 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Revealed layer: an authorized scan that types itself out             */
/* ------------------------------------------------------------------ */
const LINE_COLOR: [RegExp, string][] = [
  [/^\$/, "#f2c230"],
  [/^\[!\]/, "#ff6b6b"],
  [/^\[~\]/, "#f2c230"],
  [/^\[(\+|✓)\]/, "#3ddc97"],
  [/^\[-\]/, "rgba(230,239,233,0.45)"],
];

function ScanCanvas({ lines }: { lines: string[] }) {
  const ref = useCanvas((ctx, w, h, t) => {
    ctx.fillStyle = "#0b1210";
    ctx.fillRect(0, 0, w, h);
    // Fit the longest line to the width (monospace glyph ≈ 0.6em), capped at 13.5px.
    const longest = Math.max(...lines.map((l) => l.length));
    const size = Math.max(7.5, Math.min(13.5, (w - 36) / (longest * 0.61)));
    const lh = size * 1.95;
    ctx.font = `${size}px ${monoFamily()}`;
    ctx.textBaseline = "top";

    const text = lines.join("\n");
    const speed = 28; // ms per character
    const cycle = text.length * speed + 3500;
    let shown = Math.min(text.length, Math.floor((t % cycle) / speed));

    const block = lines.length * lh;
    const x0 = Math.max(18, (w - size * 0.61 * longest) / 2);
    const y0 = Math.max(18, (h - block) / 2);

    lines.forEach((line, k) => {
      if (shown <= 0) return;
      const visible = line.slice(0, shown);
      shown -= line.length + 1;
      const color = LINE_COLOR.find(([re]) => re.test(line))?.[1] ?? "rgba(230,239,233,0.9)";
      ctx.fillStyle = color;
      ctx.fillText(visible, x0, y0 + k * lh);
      // blinking cursor at the end of the line being typed
      if (shown < 0 && Math.floor(t / 450) % 2 === 0) {
        ctx.fillStyle = "#f2c230";
        ctx.fillRect(x0 + ctx.measureText(visible).width + 3, y0 + k * lh, size * 0.55, size * 1.15);
      }
    });
  });
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/* Scope: radar base + scan revealed under a cursor-following spotlight */
/* ------------------------------------------------------------------ */
export default function SecurityScope({
  lines,
  label,
  file,
  sample,
  description,
}: {
  lines: string[];
  label: string;
  file: string;
  sample: string;
  /** Text alternative for screen readers (the canvases are decorative). */
  description: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useSpotlight(containerRef, maskRef, ringRef, { x: 0.5, y: 0.5 });

  const mask = spotlightMask(SPOTLIGHT_R);

  return (
    <figure
      ref={containerRef}
      data-reveal
      className="relative mb-6 h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-ink sm:h-[420px]"
    >
      <figcaption className="sr-only">{description}</figcaption>

      <RadarCanvas />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      <div
        ref={maskRef}
        className="pointer-events-none absolute inset-0"
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
        <ScanCanvas lines={lines} />
        <div className="absolute inset-0 bg-[#ff4d4d]/[0.05] mix-blend-screen" />
      </div>

      {/* ring marking the spotlight */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{ transform: "translate3d(-999px,-999px,0)" }}
        aria-hidden="true"
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15"
          style={{ width: SPOTLIGHT_R * 1.5, height: SPOTLIGHT_R * 1.5 }}
        />
        <span
          className="absolute left-0 top-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.3em] text-white/55"
          style={{ transform: `translate(-50%, ${SPOTLIGHT_R * 0.75 + 10}px)` }}
        >
          {label}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-xs sm:p-5">
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-signal backdrop-blur-sm">{file}</span>
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono uppercase tracking-widest text-white/55 backdrop-blur-sm">
          {sample}
        </span>
      </div>
    </figure>
  );
}

"use client";

import { useRef } from "react";
import { monoFamily, useCanvas } from "./Backdrops";

/* Sorted stock per product; the first three match the low-stock result in the section. */
const VALUES = [3, 6, 8, 12, 16, 21, 27, 34, 41, 50, 58, 67];
const LOW = 3; // bars under the threshold
const THRESHOLD = 10;
const NOISE_TAGS = ["NULL", "DUP", "N/A"];
const CYCLE = 10000; // ms for one pass right and back
const SIGNAL = "242,194,48";
const RED = "255,77,77";

type Dot = {
  bar: number; // -1 = noise (dropped when the beam sorts it)
  tx: number;
  ty: number;
  fx: number; // raw position, fraction of the canvas
  fy: number;
  phase: number;
  speed: number;
  p: number; // 0 raw → 1 sorted
  tag?: string;
  hit: number;
};

type Layout = {
  key: string;
  x0: number;
  x1: number;
  base: number;
  maxH: number;
  bars: number;
  cw: number;
  pitch: number;
  max: number;
};

function layoutFor(w: number, h: number): Layout {
  const pitch = w < 640 ? 5 : 6;
  const bars = w < 640 ? 8 : VALUES.length;
  const x0 = Math.max(26, w * 0.06);
  const x1 = w - x0;
  const base = h * 0.82;
  const maxH = base - Math.max(64, h * 0.24);
  const cw = (x1 - x0) / bars;
  const max = VALUES[bars - 1];
  return { key: `${bars}-${pitch}-${Math.round(maxH)}-${Math.round(cw)}`, x0, x1, base, maxH, bars, cw, pitch, max };
}

function buildDots(l: Layout): Dot[] {
  const dots: Dot[] = [];
  const cols = Math.max(1, Math.min(4, Math.floor((l.cw * 0.5) / l.pitch)));
  for (let b = 0; b < l.bars; b++) {
    const rows = Math.max(1, Math.round(((VALUES[b] / l.max) * l.maxH) / l.pitch));
    const bx = l.x0 + b * l.cw + (l.cw - cols * l.pitch) / 2;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        dots.push({
          bar: b,
          tx: bx + c * l.pitch,
          ty: l.base - (r + 1) * l.pitch,
          fx: 0.04 + Math.random() * 0.92,
          fy: 0.2 + Math.random() * 0.66,
          phase: Math.random() * Math.PI * 2,
          speed: 2.5 + Math.random() * 3.5,
          p: 0,
          hit: -1e9,
        });
  }
  const noise = Math.round(dots.length * 0.18);
  for (let i = 0; i < noise; i++)
    dots.push({
      bar: -1,
      tx: 0,
      ty: 0,
      fx: 0.04 + Math.random() * 0.86,
      fy: 0.24 + Math.random() * 0.58,
      phase: Math.random() * Math.PI * 2,
      speed: 3 + Math.random() * 2,
      p: 0,
      tag: i % 5 === 0 ? NOISE_TAGS[i % NOISE_TAGS.length] : undefined,
      hit: -1e9,
    });
  return dots;
}

const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * Data section figure: a vertical scan line sweeps messy inventory records.
 * Behind the line, null/duplicate rows are dropped and the rest fly into a
 * sorted bar chart; the low-stock bars light up. On the way back the data
 * scatters again. Automatic on every device; static (sorted) under reduced motion.
 */
export default function DataScan({
  file,
  sample,
  beamLabel,
  result,
  description,
}: {
  file: string;
  sample: string;
  beamLabel: string;
  result: string;
  /** Text alternative for screen readers (the canvas is decorative). */
  description: string;
}) {
  const state = useRef<{ key: string; dots: Dot[]; last: number; prevX: number | null }>({
    key: "",
    dots: [],
    last: 0,
    prevX: null,
  });

  const ref = useCanvas((ctx, w, h, t) => {
    if (w === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const s = state.current;
    const l = layoutFor(w, h);
    if (s.key !== l.key) {
      s.key = l.key;
      s.dots = buildDots(l);
    }

    // beam position: ping-pong across the chart, slowing at both ends
    const ph = (t % CYCLE) / CYCLE;
    const fwd = ph < 0.5;
    const k = reduced ? 1 : smooth(fwd ? ph * 2 : (1 - ph) * 2);
    const bx = l.x0 - 14 + (l.x1 - l.x0 + 28) * k;
    const speedSign = reduced ? 0 : fwd ? 1 : -1;
    const dt = reduced ? 1 : Math.min(0.25, Math.max(0, (t - s.last) / 1000));
    s.last = t;
    const prevX = s.prevX ?? bx;

    ctx.fillStyle = "#0b1210";
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x < w; x += 48) ctx.fillRect(x, 0, 1, h);
    for (let y = 0; y < h; y += 48) ctx.fillRect(0, y, w, 1);

    // glow on the side already sorted
    const gw = 120;
    const gdir = speedSign >= 0 ? -1 : 1;
    const glow = ctx.createLinearGradient(bx, 0, bx + gw * gdir, 0);
    glow.addColorStop(0, `rgba(${SIGNAL},${reduced ? 0 : 0.1})`);
    glow.addColorStop(1, `rgba(${SIGNAL},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(Math.min(bx, bx + gw * gdir), 0, gw, h);

    // baseline and threshold, brighter where the data is already sorted
    const thY = l.base - (THRESHOLD / l.max) * l.maxH;
    const split = Math.max(l.x0, Math.min(l.x1, bx));
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(l.x0, l.base + 3, split - l.x0, 1);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(split, l.base + 3, l.x1 - split, 1);
    ctx.setLineDash([4, 5]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${RED},0.6)`;
    ctx.beginPath();
    ctx.moveTo(l.x0, thY);
    ctx.lineTo(split, thY);
    ctx.stroke();
    ctx.strokeStyle = `rgba(${RED},0.15)`;
    ctx.beginPath();
    ctx.moveTo(split, thY);
    ctx.lineTo(l.x1, thY);
    ctx.stroke();
    ctx.setLineDash([]);

    // records
    const size = l.pitch - 2;
    const barP = new Array(l.bars).fill(0);
    const barN = new Array(l.bars).fill(0);
    ctx.font = `10px ${monoFamily()}`;
    ctx.textBaseline = "middle";
    for (const d of s.dots) {
      const rx = d.fx * w + Math.sin(t * 0.0006 + d.phase) * 7;
      const ry = d.fy * h + Math.cos(t * 0.0005 + d.phase) * 7;
      const gateX = d.bar < 0 ? rx : d.tx;
      const goal = gateX < bx ? 1 : 0;
      d.p = reduced ? goal : d.p + (goal - d.p) * Math.min(1, dt * d.speed);
      const e = smooth(Math.max(0, Math.min(1, d.p)));

      if (d.bar < 0) {
        // noise: turns red and fades out once the beam drops it
        if (!reduced && speedSign > 0 && (prevX - rx) * (bx - rx) <= 0 && prevX !== bx) d.hit = t;
        const a = 0.35 * (1 - e);
        if (a > 0.01) {
          ctx.fillStyle = e > 0.05 ? `rgba(${RED},${a + 0.15 * (1 - e)})` : `rgba(255,255,255,${a})`;
          const sz = size * (1 - e * 0.6);
          ctx.fillRect(rx - sz / 2, ry - sz / 2, sz, sz);
        }
        const age = (t - d.hit) / 1000;
        const g = d.tag ? Math.max(0, 1 - age / 1.6) : 0;
        if (g > 0) {
          ctx.strokeStyle = `rgba(${RED},${g * 0.8})`;
          ctx.beginPath();
          ctx.arc(rx, ry, 4 + (1 - g) * 18, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(${RED},${g})`;
          ctx.fillText(d.tag!, rx + 8, ry - 10);
        }
        continue;
      }

      barP[d.bar] += e;
      barN[d.bar] += 1;
      const x = rx + (d.tx - rx) * e;
      const y = ry + (d.ty - ry) * e;
      if (d.bar < LOW) ctx.fillStyle = `rgba(${SIGNAL},${0.35 + 0.6 * e})`;
      else ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.25 * e})`;
      ctx.fillRect(x, y, size, size);
    }

    // values on top of the low-stock bars once they're assembled
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    for (let b = 0; b < LOW; b++) {
      const done = barN[b] ? barP[b] / barN[b] : 0;
      if (done < 0.6) continue;
      const a = (done - 0.6) / 0.4;
      const top = l.base - Math.round(((VALUES[b] / l.max) * l.maxH) / l.pitch) * l.pitch;
      ctx.fillStyle = `rgba(${SIGNAL},${a})`;
      ctx.fillText(String(VALUES[b]), l.x0 + b * l.cw + l.cw / 2, top - 5);
    }
    ctx.textAlign = "left";

    // result line under the chart
    const lowDone = barN.slice(0, LOW).reduce((acc, n, i) => acc + (n ? barP[i] / n : 0), 0) / LOW;
    ctx.textBaseline = "top";
    ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.3 * lowDone})`;
    ctx.fillText(`WHERE stock < ${THRESHOLD}`, l.x0, l.base + 12);
    ctx.fillStyle = `rgba(${SIGNAL},${lowDone * 0.9})`;
    ctx.textAlign = "right";
    ctx.fillText(`→ ${result}`, l.x1, l.base + 12);
    ctx.textAlign = "left";

    // the beam
    if (!reduced) {
      const line = ctx.createLinearGradient(0, 0, 0, h);
      line.addColorStop(0, `rgba(${SIGNAL},0)`);
      line.addColorStop(0.15, `rgba(${SIGNAL},0.85)`);
      line.addColorStop(0.9, `rgba(${SIGNAL},0.85)`);
      line.addColorStop(1, `rgba(${SIGNAL},0)`);
      ctx.fillStyle = line;
      ctx.fillRect(bx - 0.75, 0, 1.5, h);
      const sy = ((t * 0.22) % (h + 200)) - 100;
      const spark = ctx.createRadialGradient(bx, sy, 0, bx, sy, 60);
      spark.addColorStop(0, "rgba(255,240,190,0.9)");
      spark.addColorStop(1, "rgba(255,240,190,0)");
      ctx.fillStyle = spark;
      ctx.fillRect(bx - 2, sy - 60, 4, 120);

      // readouts riding on the beam, kept inside the frame
      const pct = String(Math.round(k * 100)).padStart(3, "0");
      const right = bx < w / 2;
      ctx.textAlign = right ? "left" : "right";
      ctx.textBaseline = "middle";
      const lx = bx + (right ? 9 : -9);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText(beamLabel.toUpperCase(), lx, h * 0.2);
      ctx.fillStyle = `rgba(${SIGNAL},0.9)`;
      ctx.fillText(`${fwd ? "▶" : "◀"} SORT ${pct}%`, lx, h * 0.2 + 15);
      ctx.textAlign = "left";
    }
    s.prevX = bx;
  });

  return (
    <figure
      data-reveal
      className="relative mt-14 h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-ink-2 sm:h-[380px]"
    >
      <figcaption className="sr-only">{description}</figcaption>
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-xs sm:p-5">
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-signal backdrop-blur-sm">{file}</span>
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono uppercase tracking-widest text-white/55 backdrop-blur-sm">
          {sample}
        </span>
      </div>
    </figure>
  );
}

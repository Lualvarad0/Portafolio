"use client";

import { useRef, type RefObject } from "react";
import { monoFamily, useCanvas } from "./Backdrops";

/** Devices with no hovering cursor: the hero shows this scan instead of the spotlight. */
export const TOUCH_QUERY = "(hover: none), (pointer: coarse)";

type Host = { fx: number; fy: number; vuln: boolean; port: string; hit: number };
const PORTS = [":22", ":80", ":443", ":3306", ":5432", ":8080", ":1433"];

const CYCLE = 7600; // ms for one full pass down and back up
const SIGNAL = "242,194,48";
// beam range (fraction of the height): clear of the navbar at the top
const P0 = 0.14;
const PR = 0.72;

/** Beam position (0..1 of the height) and signed speed (-1..1, positive = going down). */
function beam(t: number) {
  const ph = (t % CYCLE) / CYCLE;
  const down = ph < 0.5;
  const x = down ? ph * 2 : (1 - ph) * 2;
  const k = 0.5 - 0.5 * Math.cos(Math.PI * x); // ease in-out: the beam slows at both ends
  return { p: P0 + PR * k, v: Math.sin(Math.PI * x) * (down ? 1 : -1) };
}

/**
 * Touch-only hero animation: a scanner beam sweeps the hero up and down,
 * revealing the code layer behind it (via CSS vars on the reveal mask) and
 * pinging hosts as it crosses them, like the radar in the security section.
 * Hidden on devices with a hovering cursor, where the spotlight follows the mouse.
 */
export default function HeroScan({
  maskRef,
  label,
}: {
  maskRef: RefObject<HTMLElement | null>;
  label: string;
}) {
  const hosts = useRef<Host[]>([]);
  const prevY = useRef<number | null>(null);

  const ref = useCanvas((ctx, w, h, t) => {
    if (w === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (hosts.current.length === 0) {
      const n = Math.max(6, Math.min(12, Math.round((w * h) / 40000)));
      hosts.current = Array.from({ length: n }, (_, i) => ({
        fx: 0.08 + Math.random() * 0.7,
        fy: 0.46 + Math.random() * 0.32, // free band between the headline and the CTA
        vuln: i % 5 === 0,
        port: PORTS[i % PORTS.length],
        hit: -1e9,
      }));
    }

    const { p, v } = reduced ? { p: 0.55, v: 0 } : beam(t);
    const y = p * h;

    // Reveal band on the layer behind: long trail on the side already scanned.
    const u = 0.5 + 0.5 * v; // 1 = going down, 0 = going up
    const above = (0.05 + 0.26 * u) * h;
    const below = (0.05 + 0.26 * (1 - u)) * h;
    const m = maskRef.current?.style;
    if (m) {
      m.setProperty("--sy0", `${y - above}px`);
      m.setProperty("--sy1", `${y - above * 0.35}px`);
      m.setProperty("--sy2", `${y + below * 0.35}px`);
      m.setProperty("--sy3", `${y + below}px`);
    }

    ctx.clearRect(0, 0, w, h);

    // trailing glow behind the beam
    const dir = v >= 0 ? -1 : 1; // towards the scanned side
    const gl = 110;
    const glow = ctx.createLinearGradient(0, y, 0, y + gl * dir);
    glow.addColorStop(0, `rgba(${SIGNAL},${0.05 + 0.16 * Math.abs(v)})`);
    glow.addColorStop(1, `rgba(${SIGNAL},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(0, Math.min(y, y + gl * dir), w, gl);

    // the beam, fading out at the edges
    const line = ctx.createLinearGradient(0, 0, w, 0);
    line.addColorStop(0, `rgba(${SIGNAL},0)`);
    line.addColorStop(0.12, `rgba(${SIGNAL},0.85)`);
    line.addColorStop(0.88, `rgba(${SIGNAL},0.85)`);
    line.addColorStop(1, `rgba(${SIGNAL},0)`);
    ctx.fillStyle = line;
    ctx.fillRect(0, y - 0.75, w, 1.5);

    // a bright spark running along the beam
    if (!reduced) {
      const sx = ((t * 0.32) % (w + 240)) - 120;
      const spark = ctx.createRadialGradient(sx, y, 0, sx, y, 70);
      spark.addColorStop(0, "rgba(255,240,190,0.9)");
      spark.addColorStop(1, "rgba(255,240,190,0)");
      ctx.fillStyle = spark;
      ctx.fillRect(sx - 70, y - 2, 140, 4);
    }

    // side rulers, lit up near the beam
    for (let ty = 8; ty < h; ty += 16) {
      const near = Math.max(0, 1 - Math.abs(ty - y) / 90);
      const len = ty % 64 === 8 ? 10 : 5;
      ctx.fillStyle = near > 0 ? `rgba(${SIGNAL},${0.15 + near * 0.7})` : "rgba(255,255,255,0.12)";
      ctx.fillRect(6, ty, len, 1);
      ctx.fillRect(w - 6 - len, ty, len, 1);
    }

    // readouts riding on the beam
    ctx.font = `10px ${monoFamily()}`;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.textAlign = "left";
    ctx.fillText(label.toUpperCase(), 22, y - 7);
    const pct = String(Math.round(((p - P0) / PR) * 100)).padStart(3, "0");
    ctx.fillStyle = `rgba(${SIGNAL},0.9)`;
    ctx.textAlign = "right";
    ctx.fillText(`${v >= 0 ? "▼" : "▲"} SCAN ${pct}%`, w - 22, y - 7);
    ctx.textAlign = "left";

    // hosts: pinged when the beam crosses them
    const prev = prevY.current ?? y;
    for (const host of hosts.current) {
      const hx = host.fx * w;
      const hy = host.fy * h;
      if (!reduced && prev !== y && (prev - hy) * (y - hy) <= 0) host.hit = t;
      const age = (t - host.hit) / 1000;
      const g = Math.max(0, 1 - age / 2.2);
      const color = host.vuln ? "255,77,77" : "61,220,151";
      if (g > 0) {
        ctx.strokeStyle = `rgba(${color},${g * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(hx, hy, 4 + (1 - g) * 22, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = `rgba(${color},${g * (host.vuln ? 1 : 0.6)})`;
        ctx.textBaseline = "middle";
        ctx.fillText(`${host.port} ${host.vuln ? "vuln" : "ok"}`, hx + 9, hy - 10);
      }
      ctx.fillStyle = g > 0 ? `rgba(${color},${0.5 + g * 0.5})` : "rgba(255,255,255,0.28)";
      ctx.beginPath();
      ctx.arc(hx, hy, host.vuln ? 2.4 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    prevY.current = y;
  });

  return (
    <canvas
      ref={ref}
      className="hero-touch-only pointer-events-none absolute inset-0 z-40 h-full w-full"
      aria-hidden="true"
    />
  );
}

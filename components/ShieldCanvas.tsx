"use client";

import { useRef } from "react";
import { monoFamily, useCanvas } from "./Backdrops";
import { GREEN, RED, SIGNAL, reducedMotion } from "./touch";

const ATTACKS = ["SQLi", "XSS", "IDOR", "RCE", "BRUTE", "SSRF"];
const LEGIT = ["GET /", "POST /login", "200 OK", "GET /api", "PUT /perfil"];
const SPAWN_MS = 520;

type Packet = {
  x0: number; // start, fraction of the width
  bend: number; // curve offset, px
  born: number;
  life: number; // ms to reach the server
  bad: boolean;
  label: string;
  end: number; // ms when it was blocked or delivered (0 = still flying)
};
type Spark = { x: number; y: number; vx: number; vy: number; born: number };

/**
 * Touch-only figure for the security section: requests travel from the internet
 * to a server; a honeycomb shield blocks the malicious ones (SQLi, XSS…) with a
 * flash and lets legitimate traffic through. Counters keep score at the bottom.
 */
export default function ShieldCanvas({
  blocked,
  allowed,
  blockedTag,
}: {
  blocked: string;
  allowed: string;
  blockedTag: string;
}) {
  const st = useRef({
    packets: [] as Packet[],
    sparks: [] as Spark[],
    cells: [] as number[], // flash time per shield cell
    lastSpawn: 0,
    n: 0,
    blocked: 0,
    allowed: 0,
    serverPulse: -1e9,
    last: 0,
  });

  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const s = st.current;
    const cx = w / 2;
    const sy = h * 0.84; // server centre
    const R = Math.min(h * 0.4, w * 0.44); // shield radius
    const CELLS = 17;
    const A0 = Math.PI * 1.12;
    const A1 = Math.PI * 1.88;
    if (s.cells.length !== CELLS) s.cells = new Array(CELLS).fill(-1e9);
    // after a pause (scrolled away), shift the clock so packets resume mid-flight
    const gap = now - s.last;
    if (s.last && gap > 1500) {
      for (const p of s.packets) {
        p.born += gap;
        if (p.end) p.end += gap;
      }
      s.lastSpawn += gap;
    }
    s.last = now;

    ctx.fillStyle = "#050807";
    ctx.fillRect(0, 0, w, h);
    // grid
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    for (let x = 0; x < w; x += 40) ctx.fillRect(x, 0, 1, h);
    for (let y = 0; y < h; y += 40) ctx.fillRect(0, y, w, 1);

    // spawn traffic
    if (!reduced && now - s.lastSpawn > SPAWN_MS) {
      s.lastSpawn = now;
      const bad = s.n % 5 !== 1 && s.n % 5 !== 3; // 3 of every 5 are attacks
      s.packets.push({
        x0: 0.08 + Math.random() * 0.84,
        bend: (Math.random() - 0.5) * w * 0.5,
        born: now,
        life: 2200 + Math.random() * 900,
        bad,
        label: bad ? ATTACKS[s.n % ATTACKS.length] : LEGIT[s.n % LEGIT.length],
        end: 0,
      });
      s.n++;
    }

    // path of a packet at progress u (quadratic curve from the top to the server)
    const pos = (p: Packet, u: number) => {
      const x0 = p.x0 * w;
      const y0 = 54;
      const mx = (x0 + cx) / 2 + p.bend;
      const my = (y0 + sy) / 2;
      const a = 1 - u;
      return { x: a * a * x0 + 2 * a * u * mx + u * u * cx, y: a * a * y0 + 2 * a * u * my + u * u * sy };
    };

    // shield: a soft halo, then an arc of hexagons around the server
    ctx.strokeStyle = `rgba(${SIGNAL},0.07)`;
    ctx.lineWidth = 26;
    ctx.beginPath();
    ctx.arc(cx, sy, R, A0 - 0.05, A1 + 0.05);
    ctx.stroke();
    ctx.strokeStyle = `rgba(${SIGNAL},0.25)`;
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.arc(cx, sy, R - 20, A0, A1);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < CELLS; i++) {
      const ang = A0 + ((A1 - A0) * i) / (CELLS - 1);
      const hx = cx + Math.cos(ang) * R;
      const hy = sy + Math.sin(ang) * R;
      const flash = Math.max(0, 1 - (now - s.cells[i]) / 650);
      const idle = 0.18 + 0.08 * Math.sin(now * 0.002 + i * 0.7);
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = (Math.PI / 3) * k + Math.PI / 6 + ang;
        const r = 11 + flash * 3;
        if (k) ctx.lineTo(hx + Math.cos(a) * r, hy + Math.sin(a) * r);
        else ctx.moveTo(hx + Math.cos(a) * r, hy + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = flash > 0 ? `rgba(${RED},${0.12 + flash * 0.45})` : `rgba(${SIGNAL},${idle * 0.35})`;
      ctx.fill();
      ctx.strokeStyle = flash > 0 ? `rgba(${RED},${0.5 + flash * 0.5})` : `rgba(${SIGNAL},${idle + 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // packets
    ctx.font = `9px ${monoFamily()}`;
    ctx.textBaseline = "middle";
    const alive: Packet[] = [];
    for (const p of s.packets) {
      const u = Math.min(1, (now - p.born) / p.life);
      const at = pos(p, u);
      const d = Math.hypot(at.x - cx, at.y - sy);

      if (!p.end) {
        if (p.bad && d <= R + 4) {
          p.end = now;
          s.blocked++;
          const ang = Math.atan2(at.y - sy, at.x - cx);
          const idx = Math.round(((ang < 0 ? ang + Math.PI * 2 : ang) - A0) / ((A1 - A0) / (CELLS - 1)));
          if (idx >= 0 && idx < CELLS) s.cells[idx] = now;
          for (let k = 0; k < 9; k++) {
            const a = ang + (Math.random() - 0.5) * 2.4;
            const v = 0.03 + Math.random() * 0.06;
            s.sparks.push({ x: at.x, y: at.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, born: now });
          }
        } else if (!p.bad && u >= 1) {
          p.end = now;
          s.allowed++;
          s.serverPulse = now;
        }
      }

      if (p.end) {
        // "blocked" tag lingers where the attack hit
        if (p.bad && now - p.end < 900) {
          const g = 1 - (now - p.end) / 900;
          const hit = pos(p, Math.min(1, (p.end - p.born) / p.life));
          ctx.fillStyle = `rgba(${RED},${g})`;
          ctx.textAlign = "center";
          ctx.fillText(blockedTag, hit.x, hit.y - 18 - (1 - g) * 10);
          ctx.textAlign = "left";
          alive.push(p);
        }
        continue;
      }
      alive.push(p);

      // trail
      const color = p.bad ? RED : GREEN;
      ctx.strokeStyle = `rgba(${color},0.35)`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let k = 0; k <= 8; k++) {
        const q = pos(p, Math.max(0, u - 0.12 + (0.12 * k) / 8));
        if (k) ctx.lineTo(q.x, q.y);
        else ctx.moveTo(q.x, q.y);
      }
      ctx.stroke();

      // the packet: a small labelled pill
      const tw = ctx.measureText(p.label).width + 12;
      ctx.fillStyle = `rgba(${color},0.16)`;
      ctx.strokeStyle = `rgba(${color},0.9)`;
      ctx.beginPath();
      ctx.roundRect(at.x - tw / 2, at.y - 8, tw, 16, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgb(${color})`;
      ctx.textAlign = "center";
      ctx.fillText(p.label, at.x, at.y + 0.5);
      ctx.textAlign = "left";
    }
    s.packets = alive;

    // sparks from blocked attacks
    s.sparks = s.sparks.filter((sp) => now - sp.born < 600);
    for (const sp of s.sparks) {
      const age = now - sp.born;
      ctx.fillStyle = `rgba(${RED},${1 - age / 600})`;
      ctx.fillRect(sp.x + sp.vx * age, sp.y + sp.vy * age, 2, 2);
    }

    // server rack
    const pulse = Math.max(0, 1 - (now - s.serverPulse) / 700);
    const rw = 58;
    for (let k = 0; k < 3; k++) {
      const ry = sy - 16 + k * 12;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.strokeStyle = `rgba(255,255,255,${0.25 + pulse * 0.4})`;
      ctx.beginPath();
      ctx.roundRect(cx - rw / 2, ry, rw, 10, 3);
      ctx.fill();
      ctx.stroke();
      const on = Math.floor(now / (300 + k * 170)) % 2 === 0;
      ctx.fillStyle = on ? `rgb(${GREEN})` : "rgba(61,220,151,0.25)";
      ctx.fillRect(cx + rw / 2 - 9, ry + 4, 3, 3);
    }
    if (pulse > 0) {
      ctx.strokeStyle = `rgba(${GREEN},${pulse * 0.6})`;
      ctx.beginPath();
      ctx.arc(cx, sy, 34 + (1 - pulse) * 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // score
    ctx.font = `10px ${monoFamily()}`;
    ctx.textBaseline = "bottom";
    ctx.fillStyle = `rgba(${RED},0.9)`;
    ctx.fillText(`■ ${String(s.blocked).padStart(3, "0")} ${blocked.toUpperCase()}`, 16, h - 12);
    ctx.textAlign = "right";
    ctx.fillStyle = `rgba(${GREEN},0.9)`;
    ctx.fillText(`${allowed.toUpperCase()} ${String(s.allowed).padStart(3, "0")} ■`, w - 16, h - 12);
    ctx.textAlign = "left";
  });

  return <canvas ref={ref} className="touch-only absolute inset-0 h-full w-full" aria-hidden="true" />;
}

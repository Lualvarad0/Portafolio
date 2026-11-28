"use client";

import { monoFamily, useCanvas } from "./Backdrops";
import { paintChrome, paintCode } from "./codePaint";
import { GREEN, RED, SIGNAL, reducedMotion, step } from "./touch";

/*
 * Touch-only figure for the security section: a secure code review in an
 * editor. A review line scans the code, flags each vulnerable line (OWASP id in
 * the problems panel), deletes the unsafe code and types the fix.
 */
const CODE = [
  'app.get("/facturas/:id", async (req, res) => {',
  "  const { id } = req.params;",
  "  const f = await sql(`WHERE id=${id}`);",
  "  if (f.owner !== req.user.id)",
  "    return res.status(403).end();",
  "  res.send(`<h1>${f.nota}</h1>`);",
  "});",
  "",
  'const KEY = "sk_live_9f8a2c71";',
];
const VULNS = [
  { line: 2, fix: '  const f = await sql("WHERE id=$1", [id]);' },
  { line: 5, fix: "  res.send(`<h1>${escape(f.nota)}</h1>`);" },
  { line: 8, fix: "const KEY = process.env.SRI_KEY;" },
];
const INTRO = 900;
const PER = 3400;
const CHAR_MS = 32;
const END = INTRO + VULNS.length * PER;
const CYCLE = END + 2600;

const prefix = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i++;
  return i;
};

type Labels = {
  file: string;
  reviewing: string;
  done: string;
  problems: string;
  findings: string[];
  fixes: string[];
  footer: string;
};

export default function CodeReview(l: Labels) {
  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const t = reduced ? END + 100 : now % CYCLE;
    const mono = monoFamily();
    const fade = reduced ? 1 : 1 - step(t, CYCLE - 500, 500);

    ctx.fillStyle = "#0b1210";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = fade;
    paintChrome(ctx, w, l.file, `10px ${mono}`);

    const finished = t >= END;
    ctx.textAlign = "right";
    if (finished) {
      ctx.fillStyle = `rgb(${GREEN})`;
      ctx.fillText(`✓ ${l.done}`, w - 12, 12.5);
    } else {
      ctx.fillStyle = `rgba(${SIGNAL},${Math.floor(now / 400) % 2 ? 0.5 : 0.95})`;
      ctx.fillText(`● ${l.reviewing}`, w - 12, 12.5);
    }
    ctx.textAlign = "left";

    const longest = Math.max(...CODE.map((c) => c.length), ...VULNS.map((v) => v.fix.length));
    const size = Math.max(7.5, Math.min(10, (w - 40) / (longest * 0.61)));
    const lh = Math.round(size * 1.75);
    const top = 42;
    const gx = 10;
    const cx = 30;
    ctx.font = `${size}px ${mono}`;
    ctx.textBaseline = "middle";

    // where the review cursor is: sweeping towards the current vulnerable line
    const k = Math.min(VULNS.length - 1, Math.max(0, Math.floor((t - INTRO) / PER)));
    const s0 = INTRO + k * PER;
    const fromLine = k === 0 ? 0 : VULNS[k - 1].line;
    const scanY = top + (fromLine + (VULNS[k].line - fromLine) * step(t, s0, 800)) * lh;
    if (!finished && t > INTRO && !reduced) {
      const g = ctx.createLinearGradient(0, scanY - lh, 0, scanY + lh);
      g.addColorStop(0, `rgba(${SIGNAL},0)`);
      g.addColorStop(0.5, `rgba(${SIGNAL},0.12)`);
      g.addColorStop(1, `rgba(${SIGNAL},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, scanY - lh, w, lh * 2);
    }

    CODE.forEach((code, i) => {
      const y = top + i * lh;
      let text = code;
      let state: "clean" | "flagged" | "fixing" | "fixed" = "clean";
      const vi = VULNS.findIndex((v) => v.line === i);
      if (vi >= 0) {
        const v = VULNS[vi];
        const s = INTRO + vi * PER;
        const keep = prefix(code, v.fix);
        const del = code.length - keep;
        const tFlag = s + 800;
        const tDel = s + 1700;
        const tType = tDel + del * 18;
        const tDone = tType + (v.fix.length - keep) * CHAR_MS;
        if (t >= tDone) {
          state = "fixed";
          text = v.fix;
        } else if (t >= tType) {
          state = "fixing";
          text = v.fix.slice(0, keep + Math.floor((t - tType) / CHAR_MS));
        } else if (t >= tDel) {
          state = "fixing";
          text = code.slice(0, code.length - Math.floor((t - tDel) / 18));
        } else if (t >= tFlag) state = "flagged";
        if (state === "fixed") {
          const a = 0.14 * (1 - step(t, tDone + 600, 900)) + 0.05;
          ctx.fillStyle = `rgba(${GREEN},${a})`;
          ctx.fillRect(0, y - lh / 2, w, lh);
        } else if (state !== "clean") {
          ctx.fillStyle = state === "flagged" ? `rgba(${RED},0.16)` : `rgba(${SIGNAL},0.1)`;
          ctx.fillRect(0, y - lh / 2, w, lh);
          ctx.fillStyle = state === "flagged" ? `rgb(${RED})` : `rgb(${SIGNAL})`;
          ctx.fillRect(0, y - lh / 2, 2, lh);
        }
        if (state === "flagged") {
          ctx.fillStyle = `rgb(${RED})`;
          ctx.fillText("⚠", gx, y);
        } else if (state === "fixed") {
          ctx.fillStyle = `rgb(${GREEN})`;
          ctx.fillText("✓", gx, y);
        }
      }
      if (state === "clean" || state === "fixing" || vi < 0) {
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        if (vi < 0 || state === "clean") ctx.fillText(String(i + 1), gx, y);
      }
      const endX = paintCode(ctx, text, cx, y, fade);
      if (state === "fixing" && Math.floor(now / 300) % 2 === 0) {
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.fillRect(endX + 1, y - size * 0.6, size * 0.5, size * 1.2);
      }
    });

    // problems panel
    const py = top + CODE.length * lh + 10;
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, py, w, 1);
    ctx.font = `${Math.max(8, size - 1)}px ${mono}`;
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.fillText(l.problems.toUpperCase(), 12, py + 13);
    VULNS.forEach((v, i) => {
      const s = INTRO + i * PER;
      if (t < s + 800) return;
      const keep = prefix(CODE[v.line], v.fix);
      const tDone = s + 1700 + (CODE[v.line].length - keep) * 18 + (v.fix.length - keep) * CHAR_MS;
      const fixed = t >= tDone;
      const y = py + 31 + i * 17;
      ctx.globalAlpha = fade * step(t, s + 800, 300);
      ctx.fillStyle = fixed ? `rgb(${GREEN})` : `rgb(${RED})`;
      ctx.fillText(fixed ? "✓" : "✕", 12, y);
      ctx.fillStyle = fixed ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)";
      ctx.fillText(l.findings[i], 26, y);
      if (fixed) {
        ctx.textAlign = "right";
        ctx.fillStyle = `rgb(${GREEN})`;
        ctx.fillText(l.fixes[i], w - 12, y);
        ctx.textAlign = "left";
      }
    });
    ctx.globalAlpha = fade;

    // status bar
    ctx.fillStyle = finished ? `rgba(${GREEN},0.14)` : "rgba(255,255,255,0.04)";
    ctx.fillRect(0, h - 24, w, 24);
    ctx.fillStyle = finished ? `rgb(${GREEN})` : "rgba(255,255,255,0.5)";
    ctx.fillText(finished ? `✓ ${l.footer}` : "OWASP Top 10", 12, h - 12);
    ctx.globalAlpha = 1;
  });

  return <canvas ref={ref} className="touch-only absolute inset-0 h-full w-full" aria-hidden="true" />;
}

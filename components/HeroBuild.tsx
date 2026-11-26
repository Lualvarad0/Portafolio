"use client";

import { monoFamily, useCanvas } from "./Backdrops";
import { BLUE, GREEN, SIGNAL, clamp01, easeOut, reducedMotion, step } from "./touch";

/* Design size of the editor window; it's scaled to fit the free band of the hero. */
const W = 340;
const H = 258;
const CHAR_MS = 26;
const START = 600;

const KEYWORD = /^(export|function|const|return)$/;

type Labels = { title: string; button: string; compiling: string; done: string; preview: string };

function codeLines(l: Labels) {
  return [
    "export function Dashboard() {",
    "  const sales = useSales();",
    "  return (",
    `    <Card title="${l.title}">`,
    "      <Chart data={sales} />",
    `      <Button>${l.button}</Button>`,
    "    </Card>",
  ];
}

/** Paints one line of TSX with simple syntax colors. */
function paintCode(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  const re = /("[^"]*"?)|(<\/?[A-Z]\w*|\/?>)|([A-Za-z_]\w*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const tok = m[0];
    if (m[1]) ctx.fillStyle = `rgb(${GREEN})`;
    else if (m[2]) ctx.fillStyle = `rgb(${BLUE})`;
    else if (m[3] && KEYWORD.test(tok)) ctx.fillStyle = `rgb(${SIGNAL})`;
    else if (m[3] && /^[A-Z]/.test(tok)) ctx.fillStyle = `rgb(${BLUE})`;
    else ctx.fillStyle = "rgba(230,239,233,0.92)";
    ctx.fillText(tok, x, y);
    x += ctx.measureText(tok).width;
  }
  return x;
}

const backOut = (x: number) => {
  const c = 1.7;
  const p = clamp01(x) - 1;
  return 1 + (c + 1) * p * p * p + c * p * p;
};

/**
 * Touch-only hero animation, focused on development: an editor types a React
 * component and, line by line, the interface it describes assembles itself in
 * the preview below (card → chart → button), then it compiles and loops.
 * Hidden on devices with a hovering cursor, where the spotlight follows the mouse.
 */
export default function HeroBuild({ labels }: { labels: Labels }) {
  const lines = codeLines(labels);
  // time (ms into the cycle) at which each line finishes typing
  const ends: number[] = [];
  let acc = START;
  for (const line of lines) {
    acc += (line.length + 1) * CHAR_MS;
    ends.push(acc);
  }
  const cycle = ends[ends.length - 1] + 3600;

  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const t = reduced ? cycle - 1200 : now % cycle;

    ctx.clearRect(0, 0, w, h);

    // fit the window in the band between the headline and the call to action
    const top = h * 0.47;
    const bandH = h * 0.295;
    const s = Math.min(1, (w - 28) / W, bandH / H);
    const enter = reduced ? 1 : step(t, 0, 700);
    const exit = reduced ? 1 : 1 - step(t, cycle - 600, 600);
    const alpha = enter * exit;
    if (alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate((w - W * s) / 2, top + (bandH - H * s) / 2 + (1 - enter) * 14);
    ctx.scale(s, s);

    // window
    ctx.shadowColor = `rgba(${SIGNAL},0.18)`;
    ctx.shadowBlur = 36;
    ctx.fillStyle = "rgba(8,13,11,0.82)";
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 14);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // header: traffic lights, file tab, build status
    ["255,95,87", "254,188,46", "40,200,64"].forEach((c, i) => {
      ctx.fillStyle = `rgba(${c},0.85)`;
      ctx.beginPath();
      ctx.arc(14 + i * 12, 12, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = `10px ${monoFamily()}`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(${SIGNAL},0.95)`;
    ctx.fillText("Dashboard.tsx", 56, 12.5);
    const done = t >= ends[6];
    ctx.textAlign = "right";
    if (done) {
      ctx.fillStyle = `rgba(${GREEN},${0.4 + 0.6 * step(t, ends[6], 400)})`;
      ctx.fillText(`✓ ${labels.done}`, W - 12, 12.5);
    } else {
      const blink = Math.floor(t / 400) % 2 === 0 ? 0.9 : 0.45;
      ctx.fillStyle = `rgba(${SIGNAL},${blink})`;
      ctx.fillText(`● ${labels.compiling}`, W - 12, 12.5);
    }
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 24, W, 1);

    // code, typed character by character
    let shown = Math.max(0, Math.floor((t - START) / CHAR_MS));
    const lh = 14.5;
    lines.forEach((line, k) => {
      const y = 38 + k * lh;
      const visible = line.slice(0, Math.max(0, shown));
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillText(String(k + 1), 12, y);
      const endX = paintCode(ctx, visible, 28, y);
      const typing = shown >= 0 && shown <= line.length;
      if (typing && !done && Math.floor(t / 450) % 2 === 0) {
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.fillRect(endX + 1, y - 6, 5.5, 12);
      }
      shown -= line.length + 1;
    });

    // preview strip
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 141, W, 1);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = `8.5px ${monoFamily()}`;
    ctx.fillText(`${labels.preview} · localhost:3000`, 12, 151);

    // 1. card
    const card = step(t, ends[3], 500);
    if (card > 0) {
      ctx.save();
      ctx.globalAlpha = alpha * card;
      const cx = 12;
      const cy = 160;
      const cw = W - 24;
      const ch = 88;
      ctx.translate(cx + cw / 2, cy + ch / 2);
      ctx.scale(0.94 + 0.06 * card, 0.94 + 0.06 * card);
      ctx.translate(-(cx + cw / 2), -(cy + ch / 2));
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.roundRect(cx, cy, cw, ch, 10);
      ctx.fill();
      ctx.stroke();
      ctx.font = `600 12px ui-sans-serif, system-ui, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillText(labels.title, cx + 12, cy + 16);
      // growth pill once it's built
      const pill = step(t, ends[6] + 150, 400);
      if (pill > 0) {
        const tw = ctx.measureText(labels.title).width;
        ctx.globalAlpha = alpha * card * pill;
        ctx.fillStyle = `rgba(${GREEN},0.16)`;
        ctx.beginPath();
        ctx.roundRect(cx + 20 + tw, cy + 8, 40, 16, 8);
        ctx.fill();
        ctx.fillStyle = `rgb(${GREEN})`;
        ctx.font = `9px ${monoFamily()}`;
        ctx.fillText("▲ 12%", cx + 25 + tw, cy + 16.5);
      }
      ctx.restore();
    }

    // 2. chart: bars grow one after another
    const BARS = [0.35, 0.55, 0.42, 0.7, 0.62, 0.86, 0.78, 1];
    const base = 238;
    for (let i = 0; i < BARS.length; i++) {
      const g = step(t, ends[4] + i * 70, 480);
      if (g <= 0) continue;
      const bh = BARS[i] * 44 * g;
      ctx.fillStyle = i === BARS.length - 1 ? `rgba(${SIGNAL},${0.95 * card})` : `rgba(255,255,255,${0.32 * card})`;
      ctx.beginPath();
      ctx.roundRect(26 + i * 21, base - bh, 13, bh, 3);
      ctx.fill();
    }

    // 3. button pops in
    const btn = clamp01((t - ends[5]) / 420);
    if (btn > 0) {
      const sc = backOut(btn);
      const bw = 84;
      const bx = W - 26 - bw;
      const by = 208;
      ctx.save();
      ctx.translate(bx + bw / 2, by + 13);
      ctx.scale(sc, sc);
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -13, bw, 26, 13);
      ctx.fill();
      ctx.fillStyle = "#050807";
      ctx.font = `600 10.5px ui-sans-serif, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(labels.button, 0, 0.5);
      ctx.restore();
    }

    // 4. compiled: a light sweep across the finished preview
    if (!reduced && t > ends[6] && t < ends[6] + 900) {
      const sx = -60 + (W + 120) * easeOut((t - ends[6]) / 900);
      const sweep = ctx.createLinearGradient(sx - 50, 0, sx + 50, 0);
      sweep.addColorStop(0, "rgba(255,255,255,0)");
      sweep.addColorStop(0.5, "rgba(255,255,255,0.12)");
      sweep.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sweep;
      ctx.fillRect(12, 160, W - 24, 88);
    }

    ctx.restore();
  });

  return (
    <canvas
      ref={ref}
      className="touch-only pointer-events-none absolute inset-0 z-[46] h-full w-full"
      aria-hidden="true"
    />
  );
}

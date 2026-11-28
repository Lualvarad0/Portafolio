"use client";

import { monoFamily, useCanvas } from "./Backdrops";
import { GREEN, RED, SIGNAL, reducedMotion, step } from "./touch";

/*
 * Touch-only scenes for the "mobile apps" and "desktop" services: the app
 * itself at work, with plain-language captions anyone can follow, and a small
 * line of code as the developer's touch.
 */
const SANS = "ui-sans-serif, system-ui, -apple-system, sans-serif";
const DW = 300;
const DH = 150;

export type PhoneLabels = {
  title: string;
  orders: { client: string; amount: string }[];
  offline: string;
  offlineHint: string;
  syncing: string;
  synced: string;
  syncedHint: string;
};

export type DesktopLabels = {
  title: string;
  items: { name: string; price: string }[];
  total: string;
  totalValue: string;
  charge: string;
  printed: string;
};

/** Sets up the scaled design canvas; returns false while the canvas has no size. */
function frame(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#0b1210";
  ctx.fillRect(0, 0, w, h);
  const s = Math.min(w / DW, h / DH);
  ctx.translate((w - DW * s) / 2, (h - DH * s) / 2);
  ctx.scale(s, s);
  ctx.textBaseline = "middle";
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, max: number, lh: number) {
  const words = text.split(" ");
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > max && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lh;
    } else line = next;
  }
  if (line) ctx.fillText(line, x, y);
}

export function PhoneScene({ l }: { l: PhoneLabels }) {
  const ROW_AT = 1200;
  const ROW_STEP = 800;
  const SYNC_AT = ROW_AT + l.orders.length * ROW_STEP + 400;
  const DONE_AT = SYNC_AT + 1500;
  const CYCLE = DONE_AT + 3200;

  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const t = reduced ? DONE_AT + 500 : now % CYCLE;
    const mono = monoFamily();
    ctx.save();
    frame(ctx, w, h);
    ctx.globalAlpha = reduced ? 1 : 1 - step(t, CYCLE - 400, 400);

    // phone
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.roundRect(12, 6, 92, 138, 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.roundRect(48, 10, 20, 3.5, 2);
    ctx.fill();

    const synced = t >= DONE_AT;
    const syncing = t >= SYNC_AT && !synced;
    // status pill
    const pill = synced ? GREEN : syncing ? SIGNAL : RED;
    ctx.fillStyle = `rgba(${pill},0.15)`;
    ctx.beginPath();
    ctx.roundRect(20, 18, 76, 13, 6.5);
    ctx.fill();
    ctx.fillStyle = `rgb(${pill})`;
    ctx.font = `600 7.5px ${SANS}`;
    ctx.fillText(`${synced ? "✓" : syncing ? "↻" : "●"} ${synced ? l.synced : syncing ? l.syncing : l.offline}`, 25, 24.8);

    ctx.fillStyle = "#fff";
    ctx.font = `700 10px ${SANS}`;
    ctx.fillText(l.title, 20, 42);

    l.orders.forEach((o, i) => {
      const g = step(t, ROW_AT + i * ROW_STEP, 450);
      if (g <= 0) return;
      const y = 52 + i * 23 + (1 - g) * 8;
      ctx.save();
      ctx.globalAlpha *= g;
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.beginPath();
      ctx.roundRect(20, y, 76, 19, 4);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = `600 7.5px ${SANS}`;
      ctx.fillText(o.client, 25, y + 6.5);
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.font = `600 7.5px ${SANS}`;
      ctx.fillText(o.amount, 25, y + 14);
      // per-order state: saved on the phone (clock) → sent (check)
      ctx.textAlign = "right";
      ctx.fillStyle = synced ? `rgb(${GREEN})` : "rgba(255,255,255,0.45)";
      ctx.fillText(synced ? "✓" : "◷", 91, y + 10);
      ctx.textAlign = "left";
      ctx.restore();
    });

    // right column: what is happening, in plain words
    const x = 122;
    ctx.font = `9px ${mono}`;
    const cmd = "flutter run";
    const typed = cmd.slice(0, Math.max(0, Math.floor((t - 100) / 45)));
    ctx.fillStyle = `rgb(${SIGNAL})`;
    ctx.fillText("$", x, 16);
    ctx.fillStyle = "rgba(230,239,233,0.85)";
    ctx.fillText(typed, x + 9, 16);
    if (t > 100 + cmd.length * 45) {
      ctx.fillStyle = `rgb(${GREEN})`;
      ctx.fillText("✓ Android · iOS", x, 30);
    }

    // cloud (the office)
    const cx = 248;
    const cy = 62;
    ctx.fillStyle = synced ? "rgba(61,220,151,0.16)" : "rgba(255,255,255,0.08)";
    for (const [dx, dy, r] of [
      [-14, 4, 9],
      [0, -2, 13],
      [14, 5, 8],
    ]) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.roundRect(cx - 22, cy + 2, 44, 11, 5.5);
    ctx.fill();
    // orders flying to the office while syncing
    if (syncing && !reduced) {
      for (let k = 0; k < 3; k++) {
        const u = ((t - SYNC_AT) / 600 + k / 3) % 1;
        const px = 108 + (cx - 30 - 108) * u;
        const py = 80 - 16 * Math.sin(u * Math.PI);
        ctx.fillStyle = `rgba(${SIGNAL},${1 - u * 0.3})`;
        ctx.beginPath();
        ctx.roundRect(px - 4, py - 3, 8, 6, 1.5);
        ctx.fill();
      }
    }

    ctx.font = `600 9.5px ${SANS}`;
    ctx.fillStyle = synced ? `rgb(${GREEN})` : syncing ? `rgb(${SIGNAL})` : "rgba(255,255,255,0.9)";
    const headline = synced ? l.synced : syncing ? l.syncing : l.offline;
    ctx.fillText(headline, x, 98);
    ctx.font = `8.5px ${SANS}`;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    wrap(ctx, synced ? l.syncedHint : l.offlineHint, x, 113, DW - x - 8, 11);
    ctx.restore();
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

export function DesktopScene({ l }: { l: DesktopLabels }) {
  const ITEM_AT = 900;
  const ITEM_STEP = 750;
  const CHARGE_AT = ITEM_AT + l.items.length * ITEM_STEP + 300;
  const PRINT_AT = CHARGE_AT + 500;
  const DONE_AT = PRINT_AT + 1300;
  const CYCLE = DONE_AT + 3000;

  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const t = reduced ? DONE_AT + 500 : now % CYCLE;
    const mono = monoFamily();
    ctx.save();
    frame(ctx, w, h);
    ctx.globalAlpha = reduced ? 1 : 1 - step(t, CYCLE - 400, 400);

    // POS window
    const X = 8;
    const Y = 8;
    const W = 186;
    const H = 116;
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.roundRect(X, Y, W, H, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.roundRect(X, Y, W, 15, [6, 6, 0, 0]);
    ctx.fill();
    ["255,95,87", "254,188,46", "40,200,64"].forEach((c, i) => {
      ctx.fillStyle = `rgba(${c},0.85)`;
      ctx.beginPath();
      ctx.arc(X + 8 + i * 7, Y + 7.5, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = `600 8px ${SANS}`;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(l.title, X + 34, Y + 8);

    // scanned items
    l.items.forEach((it, i) => {
      const at = ITEM_AT + i * ITEM_STEP;
      const g = step(t, at, 350);
      if (g <= 0) return;
      const y = Y + 27 + i * 15;
      const flash = Math.max(0, 1 - (t - at) / 500);
      if (flash > 0) {
        ctx.fillStyle = `rgba(${RED},${0.35 * flash})`;
        ctx.fillRect(X + 4, y - 6, W - 8, 12);
      }
      ctx.save();
      ctx.globalAlpha *= g;
      ctx.font = `8px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillText(it.name, X + 10, y);
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(it.price, X + W - 10, y);
      ctx.textAlign = "left";
      ctx.restore();
    });

    // total + charge button
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(X + 8, Y + 76, W - 16, 1);
    ctx.font = `700 9px ${SANS}`;
    ctx.fillStyle = "#fff";
    ctx.fillText(l.total, X + 10, Y + 87);
    ctx.textAlign = "right";
    ctx.fillStyle = `rgb(${SIGNAL})`;
    ctx.fillText(t >= CHARGE_AT - 300 ? l.totalValue : "—", X + W - 10, Y + 87);
    ctx.textAlign = "left";
    const pressed = t >= CHARGE_AT && t < CHARGE_AT + 250;
    ctx.fillStyle = t >= CHARGE_AT ? `rgb(${SIGNAL})` : "rgba(242,194,48,0.35)";
    ctx.beginPath();
    ctx.roundRect(X + 10 + (pressed ? 2 : 0), Y + 96 + (pressed ? 1 : 0), W - 20 - (pressed ? 4 : 0), 14, 7);
    ctx.fill();
    ctx.font = `700 8px ${SANS}`;
    ctx.fillStyle = "#050807";
    ctx.textAlign = "center";
    ctx.fillText(l.charge, X + W / 2, Y + 103.5);
    ctx.textAlign = "left";

    // printer + ticket
    const PX = 206;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.roundRect(PX, 40, 84, 26, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#050807";
    ctx.fillRect(PX + 12, 62, 60, 2.5);
    ctx.fillStyle = t >= PRINT_AT && t < DONE_AT ? `rgb(${GREEN})` : "rgba(61,220,151,0.3)";
    ctx.beginPath();
    ctx.arc(PX + 74, 48, 2.2, 0, Math.PI * 2);
    ctx.fill();
    const paper = step(t, PRINT_AT, 1300);
    if (paper > 0) {
      const ph = 64 * paper;
      ctx.save();
      ctx.beginPath();
      ctx.rect(PX + 14, 64, 56, ph);
      ctx.clip();
      ctx.fillStyle = "rgba(255,255,255,0.94)";
      ctx.fillRect(PX + 14, 64, 56, 64);
      ctx.fillStyle = "rgba(5,8,7,0.55)";
      for (let i = 0; i < 4; i++) ctx.fillRect(PX + 19, 71 + i * 7, i % 2 ? 30 : 38, 2);
      ctx.font = `700 7px ${SANS}`;
      ctx.fillStyle = "#050807";
      ctx.fillText(l.totalValue, PX + 19, 106);
      ctx.fillStyle = "rgba(5,8,7,0.6)";
      for (let i = 0; i < 14; i++) ctx.fillRect(PX + 19 + i * 3, 114, i % 3 ? 1 : 2, 9);
      ctx.restore();
    }
    if (t >= DONE_AT) {
      ctx.font = `600 9px ${SANS}`;
      ctx.fillStyle = `rgba(${GREEN},${step(t, DONE_AT, 300)})`;
      ctx.textAlign = "center";
      ctx.fillText(`✓ ${l.printed}`, PX + 42, 141);
      ctx.textAlign = "left";
    }

    // developer's touch
    ctx.font = `8.5px ${mono}`;
    ctx.fillStyle = `rgba(${SIGNAL},0.9)`;
    ctx.fillText("$", X, 140);
    ctx.fillStyle = "rgba(230,239,233,0.7)";
    ctx.fillText("dotnet run", X + 9, 140);
    ctx.fillStyle = `rgb(${GREEN})`;
    ctx.fillText("✓ Windows", X + 74, 140);
    ctx.restore();
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

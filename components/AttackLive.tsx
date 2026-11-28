"use client";

import { monoFamily, useCanvas } from "./Backdrops";
import { GREEN, RED, SIGNAL, reducedMotion, step } from "./touch";

/*
 * Desktop figure for the security section: a client's online store under live
 * attack. In the browser on the left, an attacker tries SQL injection, brute
 * force and XSS, and a real customer logs in; the site blocks the attacks and
 * lets the customer through. The security panel on the right logs every attempt.
 */
const DW = 1100;
const DH = 370;
const SC = 5600; // ms per scenario
const SANS = "ui-sans-serif, system-ui, -apple-system, sans-serif";

export type AttackLabels = {
  store: string;
  login: string;
  user: string;
  password: string;
  enter: string;
  product: string;
  price: string;
  comments: string;
  post: string;
  attacker: string;
  customer: string;
  panel: string;
  blocked: string;
  allowed: string;
  protection: string;
  log: string;
  attempt: string;
  results: { blocked: string; allowed: string; neutralized: string };
  scenarios: { type: string; banner: string }[];
};

type Scenario = { kind: "sqli" | "brute" | "xss" | "legit"; user?: string; input: string; result: "blocked" | "allowed" | "neutralized" };
const SCENARIOS: Scenario[] = [
  { kind: "sqli", user: "admin' OR '1'='1' --", input: "••••••", result: "blocked" },
  { kind: "brute", user: "admin", input: "••••••", result: "blocked" },
  { kind: "xss", input: "<script>robar(cookies)</script>", result: "neutralized" },
  { kind: "legit", user: "maria@cliente.com", input: "••••••••", result: "allowed" },
];
const TYPE_AT = 500;
const CLICK_AT = 2900;
const RESULT_AT = 3200;

const resultColor = (r: Scenario["result"]) => (r === "allowed" ? GREEN : r === "neutralized" ? SIGNAL : RED);
const clock = (g: number) => {
  const s = 14 * 3600 + 32 * 60 + g * 7;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600) % 24)}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}`;
};
const ip = (g: number) => (SCENARIOS[g % 4].kind === "legit" ? "181.39.24.10" : `${45 + ((g * 37) % 140)}.${(g * 53 + 17) % 240 + 10}.${(g * 11 + 91) % 240 + 10}.${(g * 29 + 7) % 240 + 10}`);

export default function AttackLive(l: AttackLabels) {
  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const mono = monoFamily();
    const G = reduced ? 3 : Math.floor(now / SC); // global scenario index
    const t = reduced ? RESULT_AT + 900 : now % SC;
    const sc = SCENARIOS[G % 4];
    const lb = l.scenarios[G % 4];
    const attack = sc.kind !== "legit";

    ctx.fillStyle = "#050807";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for (let x = 0; x < w; x += 40) ctx.fillRect(x, 0, 1, h);
    for (let y = 0; y < h; y += 40) ctx.fillRect(0, y, w, 1);

    const s = Math.min((w - 48) / DW, (h - 76) / DH);
    ctx.save();
    ctx.translate((w - DW * s) / 2, 58 + (h - 66 - DH * s) / 2);
    ctx.scale(s, s);
    ctx.textBaseline = "middle";

    /* ---------------- browser ---------------- */
    const BW = 650;
    ctx.fillStyle = "#0d1512";
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.beginPath();
    ctx.roundRect(0, 0, BW, DH, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.roundRect(0, 0, BW, 38, [12, 12, 0, 0]);
    ctx.fill();
    ["255,95,87", "254,188,46", "40,200,64"].forEach((c, i) => {
      ctx.fillStyle = `rgba(${c},0.85)`;
      ctx.beginPath();
      ctx.arc(18 + i * 14, 19, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "rgba(255,255,255,0.07)";
    ctx.beginPath();
    ctx.roundRect(80, 9, 420, 20, 10);
    ctx.fill();
    ctx.font = `12px ${mono}`;
    // padlock
    ctx.strokeStyle = `rgb(${GREEN})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(98, 16, 3.5, Math.PI, 0);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.fillStyle = `rgb(${GREEN})`;
    ctx.fillRect(93, 16, 10, 8);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(`tienda.cliente.com${sc.kind === "xss" ? "/producto/42" : "/login"}`, 112, 19.5);

    // who is on the site right now
    const who = attack ? RED : GREEN;
    ctx.fillStyle = `rgba(${who},0.14)`;
    ctx.beginPath();
    ctx.roundRect(BW - 140, 9, 126, 20, 10);
    ctx.fill();
    ctx.font = `600 11px ${SANS}`;
    ctx.fillStyle = `rgb(${who})`;
    ctx.fillText(`● ${attack ? l.attacker : l.customer}`, BW - 130, 19.5);

    // store header
    ctx.font = `700 15px ${SANS}`;
    ctx.fillStyle = "#fff";
    ctx.fillText(l.store, 28, 62);
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(0, 80, BW, 1);

    const typed = (text: string, from: number, ms = 55) => text.slice(0, Math.max(0, Math.floor((t - from) / ms)));
    const fade = reduced ? 1 : Math.min(step(t, 0, 300), 1 - step(t, SC - 350, 350));
    ctx.globalAlpha = fade;

    const input = (x: number, y: number, wd: number, value: string, focus: boolean, bad: boolean) => {
      const shake = bad && !reduced && t > RESULT_AT && t < RESULT_AT + 400 ? Math.sin(t / 18) * 4 : 0;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.strokeStyle = bad && t > RESULT_AT ? `rgb(${RED})` : focus ? `rgba(${SIGNAL},0.8)` : "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.roundRect(x + shake, y, wd, 32, 7);
      ctx.fill();
      ctx.stroke();
      ctx.font = `13px ${mono}`;
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillText(value, x + 12 + shake, y + 16.5);
      if (focus && Math.floor(now / 450) % 2 === 0) {
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.fillRect(x + 13 + shake + ctx.measureText(value).width, y + 8, 2, 17);
      }
    };
    const button = (x: number, y: number, wd: number, label: string) => {
      const pressed = t >= CLICK_AT && t < CLICK_AT + 220;
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.beginPath();
      ctx.roundRect(x + (pressed ? 3 : 0), y + (pressed ? 2 : 0), wd - (pressed ? 6 : 0), 34, 17);
      ctx.fill();
      ctx.font = `700 13px ${SANS}`;
      ctx.fillStyle = "#050807";
      ctx.textAlign = "center";
      ctx.fillText(label, x + wd / 2, y + 17.5);
      ctx.textAlign = "left";
    };

    if (sc.kind === "xss") {
      // product page with a comments box
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.beginPath();
      ctx.roundRect(28, 100, 150, 120, 10);
      ctx.fill();
      ctx.fillStyle = "rgba(242,194,48,0.6)";
      ctx.beginPath();
      ctx.roundRect(78, 128, 50, 64, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(5,8,7,0.6)";
      ctx.fillRect(78, 128, 50, 12);
      ctx.font = `700 16px ${SANS}`;
      ctx.fillStyle = "#fff";
      ctx.fillText(l.product, 200, 116);
      ctx.font = `700 14px ${SANS}`;
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.fillText(l.price, 200, 140);
      ctx.font = `600 12px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText(l.comments, 200, 176);
      const posted = t >= RESULT_AT;
      input(200, 190, 300, posted ? "" : typed(sc.input, TYPE_AT), !posted && t >= TYPE_AT, false);
      button(512, 189, 110, l.post);
      if (posted) {
        // the comment is shown as plain text, harmless
        const g = step(t, RESULT_AT, 300);
        ctx.globalAlpha = fade * g;
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.beginPath();
        ctx.roundRect(200, 236, 422, 40, 8);
        ctx.fill();
        ctx.font = `12px ${mono}`;
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillText(sc.input, 214, 256);
        ctx.globalAlpha = fade;
      }
    } else {
      // login form
      const FX = 175;
      const FW = 300;
      ctx.font = `700 18px ${SANS}`;
      ctx.fillStyle = "#fff";
      ctx.fillText(l.login, FX, 118);
      ctx.font = `600 12px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillText(l.user, FX, 148);
      ctx.fillText(l.password, FX, 210);
      const userText = sc.user ?? "";
      const userEnd = TYPE_AT + userText.length * 55;
      if (sc.kind === "brute") {
        input(FX, 160, FW, userText, false, false);
        // five quick password attempts
        const k = Math.min(4, Math.max(0, Math.floor((t - TYPE_AT) / 480)));
        const local = (t - TYPE_AT) % 480;
        const dots = t < TYPE_AT ? "" : t >= CLICK_AT ? "••••••" : "••••••".slice(0, Math.floor(local / 60));
        input(FX, 222, FW, dots, t >= TYPE_AT && t < RESULT_AT, true);
        if (t >= TYPE_AT) {
          ctx.font = `600 12px ${SANS}`;
          ctx.fillStyle = `rgb(${RED})`;
          ctx.fillText(`${l.attempt} ${t >= CLICK_AT ? 5 : k + 1}/5`, FX, 268);
        }
      } else {
        input(FX, 160, FW, typed(userText, TYPE_AT), t >= TYPE_AT && t < userEnd, sc.kind === "sqli");
        input(FX, 222, FW, typed(sc.input, userEnd + 150, 70), t >= userEnd + 150 && t < CLICK_AT, false);
      }
      button(FX, 284, FW, l.enter);
    }

    // result banner on the page
    if (t >= RESULT_AT) {
      const g = step(t, RESULT_AT, 300);
      const c = resultColor(sc.result);
      ctx.globalAlpha = fade * g;
      ctx.fillStyle = `rgba(${c},0.16)`;
      ctx.strokeStyle = `rgba(${c},0.8)`;
      ctx.beginPath();
      ctx.roundRect(28, 326 - (1 - g) * 8, BW - 56, 32, 8);
      ctx.fill();
      ctx.stroke();
      ctx.font = `600 13px ${SANS}`;
      ctx.fillStyle = `rgb(${c})`;
      ctx.fillText(`${sc.result === "allowed" ? "✓" : "✕"}  ${lb.banner}`, 42, 342 - (1 - g) * 8);
      ctx.globalAlpha = fade;
    }
    ctx.globalAlpha = 1;

    /* ---------------- security panel ---------------- */
    const PX = 680;
    const PW = DW - PX;
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.roundRect(PX, 0, PW, DH, 12);
    ctx.fill();
    ctx.stroke();
    ctx.font = `700 14px ${SANS}`;
    ctx.fillStyle = "#fff";
    ctx.fillText(l.panel, PX + 20, 24);
    ctx.font = `11px ${mono}`;
    ctx.fillStyle = `rgba(${GREEN},${0.55 + 0.45 * (Math.floor(now / 600) % 2)})`;
    ctx.textAlign = "right";
    ctx.fillText("● LIVE", PX + PW - 20, 24);
    ctx.textAlign = "left";

    // scenarios already resolved (including the current one once it shows its result)
    const done = G + (t >= RESULT_AT ? 1 : 0);
    const legit = Math.floor(done / 4);
    const tiles = [
      { label: l.blocked, value: String(1284 + done - legit), c: RED },
      { label: l.allowed, value: String(312 + legit), c: GREEN },
      { label: l.protection, value: "100%", c: SIGNAL },
    ];
    tiles.forEach((tile, i) => {
      const x = PX + 20 + i * 132;
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      ctx.beginPath();
      ctx.roundRect(x, 44, 120, 64, 8);
      ctx.fill();
      ctx.font = `600 24px ${SANS}`;
      ctx.fillStyle = `rgb(${tile.c})`;
      ctx.fillText(tile.value, x + 12, 68);
      ctx.font = `11px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fillText(tile.label, x + 12, 94);
    });

    ctx.font = `600 11px ${SANS}`;
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(l.log.toUpperCase(), PX + 20, 132);

    // newest first; the current one slides in when resolved
    const rows = 6;
    for (let r = 0; r < rows; r++) {
      const g = done - 1 - r;
      if (g < 0) break;
      const scn = SCENARIOS[g % 4];
      const res = scn.result;
      const isNew = r === 0 && t >= RESULT_AT && !reduced;
      const appear = isNew ? step(t, RESULT_AT, 400) : 1;
      const y = 154 + r * 34 - (1 - appear) * 12;
      ctx.globalAlpha = appear * (1 - r * 0.1);
      ctx.fillStyle = isNew ? `rgba(${resultColor(res)},${0.1 * (1 - step(t, RESULT_AT + 1200, 800)) + 0.03})` : "rgba(255,255,255,0.03)";
      ctx.beginPath();
      ctx.roundRect(PX + 20, y - 13, PW - 40, 28, 6);
      ctx.fill();
      ctx.font = `11px ${mono}`;
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fillText(clock(g), PX + 30, y + 1);
      ctx.fillText(ip(g), PX + 100, y + 1);
      ctx.font = `600 12px ${SANS}`;
      ctx.fillStyle = "rgba(255,255,255,0.88)";
      ctx.fillText(l.scenarios[g % 4].type, PX + 210, y + 1);
      const tag = l.results[res];
      ctx.font = `700 10px ${SANS}`;
      const tw = ctx.measureText(tag).width + 16;
      const c = resultColor(res);
      ctx.fillStyle = `rgba(${c},0.16)`;
      ctx.beginPath();
      ctx.roundRect(PX + PW - 30 - tw, y - 8, tw, 18, 9);
      ctx.fill();
      ctx.fillStyle = `rgb(${c})`;
      ctx.fillText(tag, PX + PW - 22 - tw, y + 1.5);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}

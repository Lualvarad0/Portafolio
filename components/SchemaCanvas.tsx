"use client";

import { monoFamily, useCanvas } from "./Backdrops";
import { BLUE, GREEN, SIGNAL, reducedMotion, step } from "./touch";

/*
 * Database figure for the data section. Two layouts:
 * - narrow (phones): relational schema + query result;
 * - wide (≥ 900px): execution plan | relational schema | query result.
 */
const CYCLE = 11000;
const ROW = 15;
const HEAD = 18;
const TW = 140;

type Col = { name: string; key?: "PK" | "FK"; index?: boolean; join?: boolean };
type Table = { name: string; x: number; y: number; cols: Col[]; at: number };

const TABLES: Table[] = [
  { name: "productos", x: 0, y: 0, at: 0, cols: [{ name: "id", key: "PK", join: true }, { name: "nombre" }, { name: "precio" }] },
  {
    name: "movimientos",
    x: 180,
    y: 0,
    at: 220,
    cols: [
      { name: "id", key: "PK" },
      { name: "producto_id", key: "FK", join: true },
      { name: "bodega_id", key: "FK", index: true, join: true },
      { name: "cantidad", join: true },
    ],
  },
  { name: "bodegas", x: 0, y: 86, at: 440, cols: [{ name: "id", key: "PK", join: true }, { name: "nombre" }] },
];
const rowY = (t: Table, i: number) => t.y + HEAD + i * ROW + ROW / 2;
const LINKS = [
  { from: { x: 180, y: rowY(TABLES[1], 1) }, to: { x: TW, y: rowY(TABLES[0], 0) } },
  { from: { x: 180, y: rowY(TABLES[1], 2) }, to: { x: TW, y: rowY(TABLES[2], 0) } },
];

function bezier(l: (typeof LINKS)[number], u: number) {
  const { from: a, to: b } = l;
  const c1 = { x: a.x - 26, y: a.y };
  const c2 = { x: b.x + 26, y: b.y };
  const v = 1 - u;
  return {
    x: v * v * v * a.x + 3 * v * v * u * c1.x + 3 * v * u * u * c2.x + u * u * u * b.x,
    y: v * v * v * a.y + 3 * v * v * u * c1.y + 3 * v * u * u * c2.y + u * u * u * b.y,
  };
}

/* Execution plan, leaves first; `parent` indexes into this array. */
type PlanNode = { op: string; detail: string; rows: number; x: number; y: number; parent: number; table?: number };
const PLAN: PlanNode[] = [
  { op: "Index Seek", detail: "movimientos", rows: 1284, x: 6, y: 226, parent: 2, table: 1 },
  { op: "Seq Scan", detail: "productos", rows: 96, x: 154, y: 226, parent: 2, table: 0 },
  { op: "Hash Join", detail: "producto_id", rows: 1284, x: 80, y: 180, parent: 3 },
  { op: "Aggregate", detail: "SUM(cantidad)", rows: 96, x: 80, y: 134, parent: 4 },
  { op: "Filter", detail: "< 10", rows: 3, x: 80, y: 88, parent: 5 },
  { op: "Sort", detail: "stock ASC", rows: 3, x: 80, y: 42, parent: -1 },
];
const NW = 140;
const NH = 30;
// leaves run together, then each parent after its children
const PLAN_ORDER = [0, 0, 1, 2, 3, 4];

type Labels = {
  rows: { product: string; qty: number }[];
  resultTitle: string;
  running: string;
  done: string;
  planTitle: string;
  rowsLabel: string;
};

const fmt = (n: number) => n.toLocaleString("es-EC").replace(/\./g, " ");

export default function SchemaCanvas(props: Labels) {
  const { rows, resultTitle, running, done, planTitle, rowsLabel } = props;

  const ref = useCanvas((ctx, w, h, now) => {
    if (w === 0) return;
    const reduced = reducedMotion();
    const t = reduced ? 9000 : now % CYCLE;
    const mono = monoFamily();
    const wide = w >= 900;

    // timeline
    const T_QUERY = 2300;
    const T_PLAN = 2500; // plan nodes appear (wide)
    const T_EXEC = 3100; // plan executes bottom-up (wide)
    const EXEC_STEP = 420;
    const T_ROWS = wide ? T_EXEC + 5 * EXEC_STEP + 200 : 2900;
    const ROW_STEP = 480;
    const T_DONE = T_ROWS + rows.length * ROW_STEP + 300;

    ctx.fillStyle = "#0b1210";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.035)";
    for (let x = 0; x < w; x += 32) ctx.fillRect(x, 0, 1, h);
    for (let y = 0; y < h; y += 32) ctx.fillRect(0, y, w, 1);

    // design canvas and where each block goes inside it
    const DW = wide ? 1000 : 320;
    const DH = wide ? 280 : 240;
    const schemaAt = wide ? { x: 340, y: 64 } : { x: 0, y: 0 };
    const resultBox = wide ? { x: 700, y: 64, w: 300 } : { x: 0, y: 158, w: 320 };
    const s = wide ? Math.min((w - 48) / DW, (h - 72) / DH, 1.15) : Math.min((w - 28) / DW, (h - 72) / DH, 1.4);
    const fade = reduced ? 1 : 1 - step(t, CYCLE - 700, 700);

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate((w - DW * s) / 2, 56 + (h - 64 - DH * s) / 2);
    ctx.scale(s, s);
    ctx.textBaseline = "middle";

    const query = step(t, T_QUERY, 600);
    const execAt = (i: number) => T_EXEC + PLAN_ORDER[i] * EXEC_STEP;

    /* ---------------- schema ---------------- */
    ctx.save();
    ctx.translate(schemaAt.x, schemaAt.y);
    LINKS.forEach((l, i) => {
      const g = step(t, 1100 + i * 250, 700);
      if (g <= 0) return;
      const col = query > 0 ? SIGNAL : "255,255,255";
      ctx.strokeStyle = `rgba(${col},${0.25 + 0.45 * query})`;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let k = 0; k <= 24 * g; k++) {
        const p = bezier(l, k / 24);
        if (k) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
      }
      ctx.stroke();
      if (g >= 1) {
        // crow's foot on the "many" side, dot on the "one" side
        ctx.beginPath();
        ctx.moveTo(l.from.x - 7, l.from.y);
        ctx.lineTo(l.from.x, l.from.y - 4);
        ctx.moveTo(l.from.x - 7, l.from.y);
        ctx.lineTo(l.from.x, l.from.y + 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(l.to.x + 3, l.to.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        if (!reduced) {
          for (let k = 0; k < 3; k++) {
            const u = (((t / 1400 + k / 3 + i * 0.17) % 1) + 1) % 1;
            const p = bezier(l, u);
            ctx.fillStyle = `rgba(${query > 0 ? SIGNAL : BLUE},0.9)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    });

    TABLES.forEach((tb, ti) => {
      const g = step(t, tb.at, 600);
      if (g <= 0) return;
      // in the wide layout, a table glows while the plan scans it
      const scanning = wide
        ? PLAN.reduce((acc, n, i) => (n.table === ti ? Math.max(acc, 1 - Math.abs(t - execAt(i) - 200) / 400) : acc), 0)
        : 0;
      ctx.save();
      ctx.globalAlpha = fade * g;
      ctx.translate(0, (1 - g) * 10);
      const th = HEAD + tb.cols.length * ROW + 4;
      ctx.fillStyle = "rgba(255,255,255,0.045)";
      ctx.strokeStyle = scanning > 0 ? `rgba(${SIGNAL},${0.3 + 0.7 * scanning})` : "rgba(255,255,255,0.16)";
      ctx.lineWidth = 1 + scanning;
      ctx.beginPath();
      ctx.roundRect(tb.x, tb.y, TW, th, 8);
      ctx.fill();
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.fillStyle = "rgba(255,255,255,0.07)";
      ctx.beginPath();
      ctx.roundRect(tb.x, tb.y, TW, HEAD, [8, 8, 0, 0]);
      ctx.fill();
      ctx.font = `600 10px ${mono}`;
      ctx.fillStyle = `rgb(${SIGNAL})`;
      ctx.fillText(tb.name, tb.x + 9, tb.y + HEAD / 2 + 0.5);
      ctx.font = `9.5px ${mono}`;
      tb.cols.forEach((c, i) => {
        const y = rowY(tb, i);
        const lit = c.join ? query : 0;
        if (lit > 0) {
          ctx.fillStyle = `rgba(${SIGNAL},${0.16 * lit})`;
          ctx.fillRect(tb.x + 1, y - ROW / 2 + 1, TW - 2, ROW - 2);
        }
        ctx.fillStyle = lit > 0 ? `rgba(255,255,255,${0.75 + 0.25 * lit})` : "rgba(255,255,255,0.72)";
        ctx.fillText(c.name, tb.x + 9, y + 0.5);
        ctx.textAlign = "right";
        if (c.key) {
          ctx.fillStyle = c.key === "PK" ? `rgba(${SIGNAL},0.85)` : `rgba(${BLUE},0.85)`;
          ctx.fillText(c.key, tb.x + TW - 9, y + 0.5);
        }
        if (c.index) {
          ctx.fillStyle = `rgba(${GREEN},0.85)`;
          ctx.fillText("IX", tb.x + TW - 26, y + 0.5);
        }
        ctx.textAlign = "left";
      });
      ctx.restore();
    });
    ctx.restore();

    /* ---------------- execution plan (wide) ---------------- */
    if (wide) {
      const panel = step(t, T_PLAN - 300, 500);
      if (panel > 0) {
        ctx.save();
        ctx.globalAlpha = fade * panel;
        ctx.font = `9.5px ${mono}`;
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillText(planTitle.toUpperCase(), 6, 12);
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fillRect(6, 22, 288, 1);

        // edges child → parent, with rows flowing up while the child runs
        PLAN.forEach((n, i) => {
          if (n.parent < 0) return;
          const p = PLAN[n.parent];
          const a = { x: n.x + NW / 2, y: n.y };
          const b = { x: p.x + NW / 2, y: p.y + NH };
          const shown = step(t, T_PLAN + i * 90, 400);
          if (shown <= 0) return;
          const active = t >= execAt(i);
          ctx.strokeStyle = active ? `rgba(${SIGNAL},0.6)` : "rgba(255,255,255,0.18)";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.bezierCurveTo(a.x, a.y - 10, b.x, b.y + 10, b.x, b.y);
          ctx.stroke();
          if (!reduced && active && t < T_DONE + 800) {
            for (let k = 0; k < 2; k++) {
              const u = ((t - execAt(i)) / 700 + k / 2) % 1;
              const x = a.x + (b.x - a.x) * u;
              const y = a.y + (b.y - a.y) * u;
              ctx.fillStyle = `rgb(${SIGNAL})`;
              ctx.beginPath();
              ctx.arc(x, y, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        });

        // operator nodes
        PLAN.forEach((n, i) => {
          const shown = step(t, T_PLAN + i * 90, 400);
          if (shown <= 0) return;
          const e = execAt(i);
          const isRunning = t >= e && t < e + EXEC_STEP;
          const ran = t >= e;
          ctx.save();
          ctx.globalAlpha = fade * panel * shown;
          ctx.fillStyle = isRunning ? `rgba(${SIGNAL},0.16)` : "rgba(255,255,255,0.045)";
          ctx.strokeStyle = isRunning ? `rgb(${SIGNAL})` : ran ? `rgba(${SIGNAL},0.45)` : "rgba(255,255,255,0.16)";
          ctx.beginPath();
          ctx.roundRect(n.x, n.y, NW, NH, 6);
          ctx.fill();
          ctx.stroke();
          ctx.font = `600 9.5px ${mono}`;
          ctx.fillStyle = ran ? `rgb(${SIGNAL})` : "rgba(255,255,255,0.8)";
          ctx.fillText(n.op, n.x + 8, n.y + 10);
          ctx.font = `8.5px ${mono}`;
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.fillText(n.detail, n.x + 8, n.y + 21);
          if (ran) {
            const count = Math.round(n.rows * step(t, e, EXEC_STEP));
            ctx.textAlign = "right";
            ctx.fillStyle = `rgba(${GREEN},0.9)`;
            ctx.fillText(`${fmt(count)} ${rowsLabel}`, n.x + NW - 8, n.y + 21);
            ctx.textAlign = "left";
          }
          ctx.restore();
        });
        ctx.restore();
      }
    }

    /* ---------------- result ---------------- */
    const R = resultBox;
    const RH = 24 + rows.length * 17 + 10;
    const panel = step(t, wide ? T_PLAN : 2000, 500);
    if (panel > 0) {
      ctx.save();
      ctx.globalAlpha = fade * panel;
      ctx.fillStyle = "rgba(242,194,48,0.05)";
      ctx.strokeStyle = `rgba(${SIGNAL},0.35)`;
      ctx.beginPath();
      ctx.roundRect(R.x, R.y, R.w, RH, 8);
      ctx.fill();
      ctx.stroke();
      ctx.font = `9.5px ${mono}`;
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillText(resultTitle, R.x + 10, R.y + 12);
      ctx.textAlign = "right";
      if (t > T_DONE) {
        ctx.fillStyle = `rgb(${GREEN})`;
        ctx.fillText(`✓ ${done}`, R.x + R.w - 10, R.y + 12);
      } else {
        ctx.fillStyle = `rgba(${SIGNAL},${Math.floor(t / 350) % 2 ? 0.5 : 1})`;
        ctx.fillText(`▶ ${running}`, R.x + R.w - 10, R.y + 12);
      }
      ctx.textAlign = "left";
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(R.x + 1, R.y + 23, R.w - 2, 1);

      rows.forEach((r, i) => {
        const g = step(t, T_ROWS + i * ROW_STEP, 420);
        if (g <= 0) return;
        const y = R.y + 34 + i * 17;
        ctx.globalAlpha = fade * panel * g;
        ctx.fillStyle = "rgba(255,255,255,0.88)";
        ctx.fillText(r.product, R.x + 10 + (1 - g) * 12, y);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(R.x + R.w - 112, y - 2, 80, 4);
        ctx.fillStyle = `rgb(${SIGNAL})`;
        ctx.fillRect(R.x + R.w - 112, y - 2, 80 * (r.qty / 10) * g, 4);
        ctx.textAlign = "right";
        ctx.fillText(String(r.qty), R.x + R.w - 10, y);
        ctx.textAlign = "left";
      });
      ctx.restore();
    }

    // rows travelling into the result as the query returns them
    if (!reduced) {
      rows.forEach((_, i) => {
        const u = (t - (T_ROWS - 300 + i * ROW_STEP)) / 380;
        if (u <= 0 || u >= 1) return;
        const from = wide ? { x: schemaAt.x + 320, y: schemaAt.y + 40 } : { x: 250, y: 82 };
        const to = { x: R.x + (wide ? 4 : 30), y: R.y + 34 + i * 17 };
        ctx.fillStyle = `rgba(${SIGNAL},${1 - u * 0.4})`;
        ctx.beginPath();
        ctx.arc(from.x + (to.x - from.x) * u, from.y + (to.y - from.y) * u, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    ctx.restore();
  });

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}

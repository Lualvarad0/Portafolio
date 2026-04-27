"use client";

import { useState, useEffect } from "react";

interface Line {
  type: "cmd" | "out";
  text: string;
}

const LINES: Line[] = [
  { type: "cmd", text: "whoami" },
  { type: "out", text: "Full Stack Dev | Backend Developer | Aspiring Pentester" },
  { type: "cmd", text: "cat services.txt" },
  { type: "out", text: "Frontend · Backend · DevOps · Security" },
  { type: "cmd", text: "nmap -sV localhost" },
  { type: "out", text: "PORT 443/tcp  open  https" },
  { type: "out", text: "PORT 22/tcp   open  ssh" },
  { type: "out", text: "Security: ✓ hardened" },
  { type: "cmd", text: "uptime" },
  { type: "out", text: "5+ years · always learning" },
];

const CMD_DELAY = 400;
const OUT_DELAY = 150;

export default function Terminal() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;

    const showNext = () => {
      if (current >= LINES.length) return;
      setVisibleCount(current + 1);
      current++;
      const next = LINES[current];
      const delay = next ? (next.type === "cmd" ? CMD_DELAY : OUT_DELAY) : 0;
      if (current < LINES.length) {
        timer = setTimeout(showNext, delay);
      }
    };

    timer = setTimeout(showNext, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const visibleLines = LINES.slice(0, visibleCount);
  const isLastLine = visibleCount === LINES.length;

  return (
    <div
      className="rounded-xl overflow-hidden w-full"
      style={{
        background: "var(--bg3)",
        border: "1px solid var(--border)",
        fontFamily: "var(--font-jetbrains), monospace",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid var(--border)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ background: "#f43f5e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#f59e0b" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#22c55e" }} />
        <span
          className="ml-3 text-xs tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          terminal — bash
        </span>
      </div>

      {/* Body */}
      <div className="p-5 min-h-[280px] text-sm leading-relaxed">
        {visibleLines.map((line, i) => (
          <div key={i} className="mb-1">
            {line.type === "cmd" ? (
              <span>
                <span style={{ color: "var(--accent)" }}>$ </span>
                <span style={{ color: "var(--text)" }}>{line.text}</span>
              </span>
            ) : (
              <span style={{ color: "var(--muted)" }}>→ {line.text}</span>
            )}
            {isLastLine && i === visibleLines.length - 1 && (
              <span
                className="inline-block w-2 h-4 ml-0.5 align-middle"
                style={{
                  background: "var(--accent)",
                  opacity: showCursor ? 1 : 0,
                  transition: "opacity 0.1s",
                }}
              />
            )}
          </div>
        ))}
        {!isLastLine && visibleCount > 0 && (
          <span
            className="inline-block w-2 h-4 ml-0.5 align-middle"
            style={{
              background: "var(--accent)",
              opacity: showCursor ? 1 : 0,
              transition: "opacity 0.1s",
            }}
          />
        )}
      </div>
    </div>
  );
}

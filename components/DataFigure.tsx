"use client";

import SchemaCanvas from "./SchemaCanvas";

/**
 * Data section figure: a database at work. On wide screens, the execution plan,
 * the relational schema and the query result; on phones, schema and result.
 * Automatic on every device (no cursor needed); static under reduced motion.
 */
export default function DataFigure({
  file,
  sample,
  description,
  schema,
}: {
  file: string;
  sample: string;
  /** Text alternative for screen readers (the canvas is decorative). */
  description: string;
  schema: {
    rows: { product: string; qty: number }[];
    resultTitle: string;
    running: string;
    done: string;
    planTitle: string;
    rowsLabel: string;
  };
}) {
  return (
    <figure
      data-reveal
      className="relative mt-14 h-[320px] overflow-hidden rounded-3xl border border-white/10 bg-ink-2 sm:h-[380px]"
    >
      <figcaption className="sr-only">{description}</figcaption>
      <SchemaCanvas {...schema} />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-xs sm:p-5">
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-signal backdrop-blur-sm">{file}</span>
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono uppercase tracking-widest text-white/55 backdrop-blur-sm">
          {sample}
        </span>
      </div>
    </figure>
  );
}

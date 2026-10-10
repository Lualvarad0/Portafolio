import type { CSSProperties, ReactNode } from "react";

export const WRAP = "mx-auto w-full max-w-[1280px] px-5 sm:px-10 md:px-14";

export function Kicker({
  children,
  dark = false,
  dot = "bg-signal",
}: {
  children: ReactNode;
  dark?: boolean;
  dot?: string;
}) {
  return (
    <p
      className={`mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] ${
        dark ? "text-white/60" : "text-neutral-600"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function Title({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <h2
      className={`text-4xl font-normal leading-[0.98] sm:text-5xl md:text-6xl ${dark ? "text-white" : "text-neutral-950"}`}
      style={{ letterSpacing: "-0.06em", textWrap: "balance" } as CSSProperties}
    >
      {children}
    </h2>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return (
    <span className="font-playfair" style={{ letterSpacing: "-0.04em" }}>
      {children}
    </span>
  );
}

/** Tag handlers for next-intl rich text: "<em>…</em>" and "<br></br>" in messages. */
export const richTags = {
  em: (chunks: ReactNode) => <Em>{chunks}</Em>,
  br: () => <br />,
};

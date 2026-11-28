"use client";

import AttackLive, { type AttackLabels } from "./AttackLive";
import CodeReview from "./CodeReview";

/**
 * Security section figure. Phones and narrow screens: a secure code review that
 * flags and fixes vulnerable lines. Wider screens: a client's online store under
 * live attack, with a security panel logging every attempt.
 */
export default function SecurityScope({
  file,
  sample,
  description,
  review,
  live,
}: {
  file: string;
  sample: string;
  /** Text alternative for screen readers (the canvases are decorative). */
  description: string;
  review: Parameters<typeof CodeReview>[0];
  live: AttackLabels;
}) {
  return (
    <figure
      data-reveal
      className="relative mb-6 h-[340px] overflow-hidden rounded-3xl border border-white/10 bg-ink sm:h-[420px]"
    >
      <figcaption className="sr-only">{description}</figcaption>

      <CodeReview {...review} />

      <div className="touch-hide absolute inset-0" aria-hidden="true">
        <AttackLive {...live} />
      </div>

      <div className="touch-hide pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-4 text-xs sm:p-5">
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono text-signal backdrop-blur-sm">{file}</span>
        <span className="rounded-md bg-black/50 px-2.5 py-1 font-mono uppercase tracking-widest text-white/55 backdrop-blur-sm">
          {sample}
        </span>
      </div>
    </figure>
  );
}

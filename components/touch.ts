/** Phones and tablets (no hovering cursor) and narrow screens: they get their own animations instead of the cursor spotlight. */
export const TOUCH_QUERY = "(hover: none), (pointer: coarse), (max-width: 767px)";

/** Shared canvas helpers for the touch animations. */
export const SIGNAL = "242,194,48";
export const GREEN = "61,220,151";
export const RED = "255,77,77";
export const BLUE = "124,199,255";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
/** Ease-out cubic. */
export const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);
/** Progress of a step that starts at `start` and lasts `dur` (both ms), eased. */
export const step = (t: number, start: number, dur: number) => easeOut((t - start) / dur);

export function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

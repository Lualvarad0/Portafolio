import { BLUE, GREEN, SIGNAL } from "./touch";

const KEYWORD = /^(const|let|async|await|return|if|export|function|new|import|from)$/;

/**
 * Paints one line of JS/TS on a canvas with simple syntax colors and returns
 * the x where it ended. Strings green, keywords yellow, types blue, numbers orange.
 */
export function paintCode(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, alpha = 1) {
  const re = /(\/\/.*$)|("[^"]*"?|`[^`]*`?|'[^']*'?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const tok = m[0];
    if (m[1]) ctx.fillStyle = `rgba(255,255,255,${0.35 * alpha})`;
    else if (m[2]) ctx.fillStyle = `rgba(${GREEN},${alpha})`;
    else if (m[3]) ctx.fillStyle = `rgba(255,155,107,${alpha})`;
    else if (m[4] && KEYWORD.test(tok)) ctx.fillStyle = `rgba(${SIGNAL},${alpha})`;
    else if (m[4] && /^[A-Z]/.test(tok)) ctx.fillStyle = `rgba(${BLUE},${alpha})`;
    else ctx.fillStyle = `rgba(230,239,233,${0.92 * alpha})`;
    ctx.fillText(tok, x, y);
    x += ctx.measureText(tok).width;
  }
  return x;
}

/** Window chrome shared by the touch animations: traffic lights + a title. */
export function paintChrome(ctx: CanvasRenderingContext2D, w: number, title: string, font: string) {
  ["255,95,87", "254,188,46", "40,200,64"].forEach((c, i) => {
    ctx.fillStyle = `rgba(${c},0.85)`;
    ctx.beginPath();
    ctx.arc(14 + i * 12, 12, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgba(${SIGNAL},0.95)`;
  ctx.fillText(title, 56, 12.5);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, 24, w, 1);
}

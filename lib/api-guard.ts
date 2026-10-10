// Shared protections for public POST endpoints that trigger notifications.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16 * 1024;

// In-memory, per-instance limiter. On serverless each warm instance keeps its own
// counters, so this is best-effort; swap for Upstash/Vercel KV if abuse appears.
const hits = new Map<string, number[]>();

function clientIp(request: Request): string {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return recent.length > MAX_REQUESTS;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}

/**
 * Returns an error Response if the request should be rejected,
 * otherwise the parsed JSON body.
 */
export async function guardRequest(
  request: Request,
  bucket: string
): Promise<{ error: Response } | { body: unknown }> {
  if (!isSameOrigin(request)) {
    return { error: Response.json({ error: "Forbidden" }, { status: 403 }) };
  }

  if (isRateLimited(`${bucket}:${clientIp(request)}`)) {
    return {
      error: Response.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(WINDOW_MS / 1000) } }
      ),
    };
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return { error: Response.json({ error: "Payload too large" }, { status: 413 }) };
  }

  try {
    return { body: JSON.parse(raw) };
  } catch {
    return { error: Response.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
}

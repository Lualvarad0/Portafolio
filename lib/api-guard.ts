// Shared protections for public POST endpoints that trigger notifications.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_BODY_BYTES = 16 * 1024;
const MAX_KEYS = 5000;

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

function retryAfter(key: string): number {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.size >= MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  // Rejected requests must not grow the bucket or extend the cooldown.
  if (recent.length >= MAX_REQUESTS) {
    return Math.max(1, Math.ceil((recent[0] + WINDOW_MS - now) / 1000));
  }
  // Bound memory even when requests arrive from many different addresses.
  if (!hits.has(key) && hits.size >= MAX_KEYS) return WINDOW_MS / 1000;
  recent.push(now);
  hits.set(key, recent);
  return 0;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
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

  const waitSeconds = retryAfter(`${bucket}:${clientIp(request)}`);
  if (waitSeconds) {
    return {
      error: Response.json(
        { error: "Too many requests" },
        { status: 429, headers: { "Retry-After": String(waitSeconds) } }
      ),
    };
  }

  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
    return { error: Response.json({ error: "Payload too large" }, { status: 413 }) };
  }
  const reader = request.body?.getReader();
  if (!reader) return { error: Response.json({ error: "Invalid JSON" }, { status: 400 }) };
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { error: Response.json({ error: "Payload too large" }, { status: 413 }) };
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    return { body: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { error: Response.json({ error: "Invalid JSON" }, { status: 400 }) };
  } finally {
    reader.releaseLock();
  }
}

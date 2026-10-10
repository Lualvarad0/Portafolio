import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import type { NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return intlMiddleware(request);
}

export const config = {
  // OG/Twitter images are already per-locale routes; redirecting them breaks social previews.
  matcher: ["/((?!_next|api|.*opengraph-image|.*twitter-image|.*\\..*).*)"],
};

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
  // Spanish lives at "/" and English at "/en" — matches canonical/hreflang/sitemap.
  localePrefix: "as-needed",
  // Each URL always serves the same language (no Accept-Language redirects),
  // so crawlers index what the hreflang tags promise.
  localeDetection: false,
  // Without detection the locale cookie is useless; dropping it keeps the site cookie-free.
  localeCookie: false,
  // Localized slugs: internal route → public URL per locale.
  pathnames: {
    "/": "/",
    "/privacy": { es: "/privacidad", en: "/privacy" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

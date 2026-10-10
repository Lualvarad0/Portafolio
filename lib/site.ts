import { routing, type AppPathname, type Locale } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.alvarado-dev.com").replace(/\/$/, "");

function localizedPath(locale: Locale, pathname: AppPathname): string {
  const entry = routing.pathnames[pathname];
  const path = typeof entry === "string" ? entry : entry[locale];
  return path === "/" ? "" : path;
}

/** Absolute URL for a route in a locale, following the "as-needed" prefix strategy. */
export function localeUrl(locale: Locale, pathname: AppPathname = "/"): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${SITE_URL}${prefix}${localizedPath(locale, pathname)}`;
}

export function languageAlternates(pathname: AppPathname = "/"): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, pathname)])),
    "x-default": localeUrl(routing.defaultLocale, pathname),
  };
}

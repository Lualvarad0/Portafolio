import { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { languageAlternates, localeUrl } from "@/lib/site";

const PAGES: { pathname: AppPathname; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
  { pathname: "/", priority: 1, changeFrequency: "monthly" },
  { pathname: "/privacy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ pathname, priority, changeFrequency }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, pathname),
      lastModified: new Date(),
      changeFrequency,
      priority: locale === routing.defaultLocale ? priority : priority * 0.9,
      alternates: { languages: languageAlternates(pathname) },
    }))
  );
}

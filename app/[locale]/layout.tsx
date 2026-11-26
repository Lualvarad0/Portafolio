import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, languageAlternates, localeUrl } from "@/lib/site";
import { BRAND, CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, OWNER, OWNER_SHORT } from "@/lib/brand";
import Chatbot from "@/components/Chatbot";
import { Analytics } from "@vercel/analytics/next";
import "../globals.css";

// Self-hosted by next/font: no requests to Google from the visitor's browser.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  themeColor: "#050807",
  viewportFit: "cover",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const pageUrl = localeUrl(locale as Locale);

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    applicationName: BRAND,
    alternates: {
      canonical: pageUrl,
      languages: languageAlternates(),
    },
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      type: "website",
      locale: locale === "es" ? "es_EC" : "en_US",
      siteName: BRAND,
      url: pageUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
    },
    authors: [{ name: OWNER, url: SITE_URL }],
    creator: OWNER,
    publisher: BRAND,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "meta" });

  const pageUrl = localeUrl(locale as Locale);
  const founder = {
    "@type": "Person",
    "@id": `${SITE_URL}/#david-alvarado`,
    name: OWNER,
    alternateName: OWNER_SHORT,
    jobTitle: locale === "es" ? "Desarrollador Full Stack e Ingeniero de Seguridad" : "Full Stack Developer & Security Engineer",
    description: t("description"),
    url: SITE_URL,
    image: `${SITE_URL}/${locale}/opengraph-image`,
    email: CONTACT_EMAIL,
    worksFor: { "@id": `${SITE_URL}/#business` },
    address: { "@type": "PostalAddress", addressLocality: "Guayaquil", addressCountry: "EC" },
    nationality: { "@type": "Country", name: "Ecuador" },
    knowsAbout: ["Software development", "Next.js", "React", ".NET", "Flutter", "SQL Server", "PostgreSQL", "Cybersecurity", "OWASP"],
    sameAs: [GITHUB_URL, LINKEDIN_URL],
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      founder,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${OWNER} · ${BRAND}`,
        alternateName: [OWNER_SHORT, BRAND],
        inLanguage: locale,
        author: { "@id": founder["@id"] },
        publisher: { "@id": founder["@id"] },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile`,
        url: pageUrl,
        name: t("title"),
        inLanguage: locale,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: { "@id": founder["@id"] },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: BRAND,
        description: t("description"),
        url: pageUrl,
        logo: `${SITE_URL}/brand/cornerstone-mark.svg`,
        email: CONTACT_EMAIL,
        founder: { "@id": founder["@id"] },
        areaServed: ["EC", "Worldwide"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Guayaquil",
          addressCountry: "EC",
        },
        knowsAbout: [
          "Custom software development",
          "Web systems",
          "Mobile apps",
          "Desktop apps",
          "Databases",
          "Power BI",
          "Cloud",
          "DevOps",
          "OWASP",
          "Penetration testing",
          "Security audits",
        ],
        sameAs: [GITHUB_URL, LINKEDIN_URL],
      },
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Chatbot />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

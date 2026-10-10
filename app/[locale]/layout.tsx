import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, languageAlternates, localeUrl } from "@/lib/site";
import { BRAND, CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/brand";
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
    authors: [{ name: "David Alvarado", url: SITE_URL }],
    creator: "David Alvarado",
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

  const founder = {
    "@type": "Person",
    "@id": `${SITE_URL}/#david-alvarado`,
    name: "David Alvarado",
    jobTitle: "Full Stack Developer & Security Engineer",
    url: SITE_URL,
    sameAs: ["https://github.com/Lualvarad0", LINKEDIN_URL],
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      founder,
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#business`,
        name: BRAND,
        description: t("description"),
        url: localeUrl(locale as Locale),
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
        sameAs: ["https://github.com/Lualvarad0", LINKEDIN_URL],
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

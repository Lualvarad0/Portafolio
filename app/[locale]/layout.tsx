import type { Metadata } from "next";
import { Barlow, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Chatbot from "@/components/Chatbot";
import "../globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://da.dev"),
  title: "David Alvarado | Full Stack & Security",
  description:
    "Full-stack developer with security expertise. I build robust apps and audit them so they stay that way. Based in Guayaquil, Ecuador.",
  keywords: [
    "full stack developer",
    "security",
    "devops",
    "next.js",
    "react",
    "pentest",
    "Ecuador",
  ],
  openGraph: {
    title: "David Alvarado | Full Stack & Security",
    description:
      "Full-stack development with security baked in from day one.",
    type: "website",
    locale: "en_US",
    siteName: "da.dev",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "David Alvarado — Full Stack & Security" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "David Alvarado | Full Stack & Security",
    description:
      "Full-stack development with security baked in from day one.",
    images: ["/og-image.png"],
  },
};

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

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${barlow.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg text-text antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Chatbot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

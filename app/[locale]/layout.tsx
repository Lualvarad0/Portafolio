import type { Metadata } from "next";
import { Barlow, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Chatbot from "@/components/Chatbot";
import { Analytics } from "@vercel/analytics/next";
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.alvarado-dev.com"),
    title: isSpanish
      ? "David Alvarado | Desarrollador Web Full Stack en Guayaquil, Ecuador"
      : "David Alvarado | Full Stack Web Developer in Guayaquil, Ecuador",
    description: isSpanish
      ? "Desarrollador web full stack en Guayaquil, Ecuador. Especialista en desarrollo de sistemas web, páginas web profesionales, auditorías de seguridad OWASP. Servicios de desarrollo frontend, backend y DevOps."
      : "Full-stack web developer in Guayaquil, Ecuador. Specialist in web systems development, professional websites, OWASP security audits. Frontend, backend and DevOps services.",
    keywords: isSpanish
      ? ["desarrollador web Guayaquil", "sistemas web Ecuador", "páginas web profesionales Ecuador", "desarrollo full stack Ecuador", "auditoría seguridad web", "frontend React", "backend Node.js", "DevOps AWS"]
      : ["web developer Guayaquil", "web systems Ecuador", "professional websites Ecuador", "full stack development Ecuador", "web security audit", "React frontend", "Node.js backend", "AWS DevOps"],
    alternates: {
      canonical: `https://www.alvarado-dev.com${locale === 'en' ? '/en' : ''}`,
      languages: {
        'es': 'https://www.alvarado-dev.com',
        'en': 'https://www.alvarado-dev.com/en',
      },
    },
    openGraph: {
      title: isSpanish
        ? "David Alvarado | Desarrollador Web Full Stack en Guayaquil, Ecuador"
        : "David Alvarado | Full Stack Web Developer in Guayaquil, Ecuador",
      description: isSpanish
        ? "Desarrollo full-stack con seguridad integrada desde el día uno. Construyo apps robustas y audito su seguridad."
        : "Full-stack development with security baked in from day one. I build robust apps and audit them so they stay that way.",
      type: "website",
      locale: isSpanish ? "es_EC" : "en_US",
      siteName: "alvarado-dev.com",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "David Alvarado — Full Stack & Security" }],
      url: `https://www.alvarado-dev.com${locale === 'en' ? '/en' : ''}`,
    },
    twitter: {
      card: "summary_large_image",
      title: isSpanish
        ? "David Alvarado | Desarrollador Web Full Stack en Guayaquil, Ecuador"
        : "David Alvarado | Full Stack Web Developer in Guayaquil, Ecuador",
      description: isSpanish
        ? "Desarrollo full-stack con seguridad integrada desde el día uno."
        : "Full-stack development with security baked in from day one.",
      images: ["/og-image.png"],
    },
    authors: [{ name: "David Alvarado", url: "https://www.alvarado-dev.com" }],
    creator: "David Alvarado",
    publisher: "David Alvarado",
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
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
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

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "David Alvarado",
    "jobTitle": "Full Stack Web Developer",
    "url": "https://www.alvarado-dev.com",
    "email": "lui.alv.ron.25@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Guayaquil",
      "addressCountry": "Ecuador"
    },
    "knowsAbout": [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "NestJS",
      ".NET",
      "PostgreSQL",
      "Docker",
      "AWS",
      "OWASP",
      "Security Audits",
      "DevOps",
      "Frontend Development",
      "Backend Development",
      "Web Systems",
      "Professional Websites"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Full Stack Web Developer",
      "occupationLocation": {
        "@type": "City",
        "name": "Guayaquil",
        "addressCountry": "Ecuador"
      }
    },
    "offers": [
      {
        "@type": "Service",
        "name": "Frontend Development",
        "description": "Development of modern, responsive web interfaces using React, Next.js, and TypeScript.",
        "provider": {
          "@type": "Person",
          "name": "David Alvarado"
        }
      },
      {
        "@type": "Service",
        "name": "Backend Development",
        "description": "Robust API development with Node.js, NestJS, .NET, and databases.",
        "provider": {
          "@type": "Person",
          "name": "David Alvarado"
        }
      },
      {
        "@type": "Service",
        "name": "DevOps & Cloud",
        "description": "CI/CD pipelines, Docker containers, and AWS infrastructure setup.",
        "provider": {
          "@type": "Person",
          "name": "David Alvarado"
        }
      },
      {
        "@type": "Service",
        "name": "Security Audits",
        "description": "OWASP-compliant web application security testing and remediation reports.",
        "provider": {
          "@type": "Person",
          "name": "David Alvarado"
        }
      }
    ],
    "sameAs": [
      "https://github.com/davidalvarado",
      "https://linkedin.com/in/david-alvarado-ronquillo"
    ]
  };

  return (
    <html
      lang={locale}
      className={`${barlow.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Chatbot />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

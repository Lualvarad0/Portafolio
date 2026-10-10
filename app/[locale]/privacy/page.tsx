import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { CONTROLLER, PRIVACY_LAST_UPDATED, privacyContent } from "@/lib/legal/privacy";
import { languageAlternates, localeUrl } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

function resolveLocale(locale: string): Locale {
  if (!routing.locales.includes(locale as Locale)) notFound();
  return locale as Locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const c = privacyContent[locale];

  return {
    title: c.metaTitle,
    description: c.metaDescription,
    alternates: {
      canonical: localeUrl(locale, "/privacy"),
      languages: languageAlternates("/privacy"),
    },
    openGraph: { title: c.metaTitle, description: c.metaDescription, url: localeUrl(locale, "/privacy") },
  };
}

/** Turns the controller's email address inside a paragraph into a mailto link. */
function withEmailLink(text: string) {
  const parts = text.split(CONTROLLER.email);
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <a
            key={i}
            href={`mailto:${CONTROLLER.email}`}
            className="underline underline-offset-2 hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {CONTROLLER.email}
          </a>,
          part,
        ]
  );
}

export default async function PrivacyPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  const c = privacyContent[locale];
  const updated = new Date(`${PRIVACY_LAST_UPDATED}T12:00:00Z`).toLocaleDateString(
    locale === "es" ? "es-EC" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-24 px-6 md:px-12 lg:px-24" style={{ background: "var(--bg)" }}>
        <article className="max-w-3xl mx-auto">
          <Link
            href="/"
            className="inline-block text-xs font-mono tracking-widest uppercase mb-10 hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            {c.backLabel}
          </Link>

          <h1
            className="text-5xl md:text-6xl font-display font-black uppercase mb-4"
            style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
          >
            {c.title}
          </h1>
          <p className="text-xs font-mono mb-8" style={{ color: "var(--muted)" }}>
            {c.updatedLabel}: <time dateTime={PRIVACY_LAST_UPDATED}>{updated}</time>
          </p>
          <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text)" }}>
            {c.intro}
          </p>

          <nav
            aria-label={c.tocLabel}
            className="rounded-xl p-6 mb-12"
            style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono font-semibold tracking-widest uppercase mb-3" style={{ color: "var(--accent)" }}>
              {c.tocLabel}
            </p>
            <ol className="grid gap-1.5 text-sm">
              {c.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:underline" style={{ color: "var(--text)" }}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {c.sections.map((s) => (
            <section key={s.id} id={s.id} className="mb-10 scroll-mt-28">
              <h2
                className="text-2xl font-display font-bold mb-4"
                style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
              >
                {s.title}
              </h2>

              {s.paragraphs?.map((p, i) => (
                <p key={i} className="leading-relaxed mb-4" style={{ color: "var(--text)" }}>
                  {withEmailLink(p)}
                </p>
              ))}

              {s.list && (
                <ul className="list-disc pl-6 mb-4 grid gap-2">
                  {s.list.map((item, i) => (
                    <li key={i} className="leading-relaxed" style={{ color: "var(--text)" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {s.note && (
                <p className="leading-relaxed mb-4" style={{ color: "var(--text)" }}>
                  {s.note}
                </p>
              )}

              {s.providers && (
                <div className="grid gap-3">
                  {s.providers.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-lg p-4"
                      style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                        <a
                          href={p.policyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold underline underline-offset-2 hover:opacity-80"
                          style={{ color: "var(--accent)" }}
                        >
                          {p.name}
                        </a>
                        <span className="text-xs font-mono" style={{ color: "var(--muted)" }}>
                          {p.location}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
                        {p.purpose}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </>
  );
}

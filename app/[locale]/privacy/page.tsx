import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Kicker, WRAP } from "@/components/ui";
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
            className="font-medium text-neutral-950 underline decoration-signal decoration-2 underline-offset-4 hover:decoration-neutral-950"
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
      {/* Dark band behind the fixed navbar */}
      <div className="bg-ink pb-20 pt-32 text-white sm:pt-40">
        <div className={WRAP}>
          <Link href="/" className="mb-10 inline-block text-xs font-medium uppercase tracking-[0.25em] text-white/60 hover:text-white">
            {c.backLabel}
          </Link>
          <Kicker dark>LOPDP · Ecuador</Kicker>
          <h1 className="text-5xl font-normal leading-[0.95] sm:text-7xl" style={{ letterSpacing: "-0.06em" }}>
            {c.title}
          </h1>
          <p className="mt-6 text-sm text-white/55">
            {c.updatedLabel}: <time dateTime={PRIVACY_LAST_UPDATED}>{updated}</time>
          </p>
        </div>
      </div>

      <main className="bg-white py-16 sm:py-24">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[280px_1fr]`}>
          <nav aria-label={c.tocLabel} className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-neutral-500">{c.tocLabel}</p>
            <ol className="grid gap-2 text-sm">
              {c.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-neutral-600 hover:text-neutral-950">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="max-w-3xl text-neutral-800">
            <p className="mb-12 text-lg leading-relaxed text-neutral-700">{c.intro}</p>

            {c.sections.map((s) => (
              <section key={s.id} id={s.id} className="mb-12 scroll-mt-28 border-t border-neutral-200 pt-8">
                <h2 className="mb-5 text-2xl font-medium text-neutral-950 sm:text-3xl" style={{ letterSpacing: "-0.04em" }}>
                  {s.title}
                </h2>

                {s.paragraphs?.map((p, i) => (
                  <p key={i} className="mb-4 leading-relaxed">
                    {withEmailLink(p)}
                  </p>
                ))}

                {s.list && (
                  <ul className="mb-4 grid gap-2 pl-5 marker:text-signal-dark [list-style:disc]">
                    {s.list.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {s.note && <p className="mb-4 leading-relaxed">{s.note}</p>}

                {s.providers && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {s.providers.map((p) => (
                      <div key={p.name} className="rounded-3xl bg-neutral-100 p-5">
                        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                          <a
                            href={p.policyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-neutral-950 underline decoration-signal decoration-2 underline-offset-4"
                          >
                            {p.name}
                          </a>
                          <span className="text-xs text-neutral-500">{p.location}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-neutral-700">{p.purpose}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

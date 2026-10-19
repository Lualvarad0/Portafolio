import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, Cloud, Globe, Monitor, Plug, ShieldAlert, Smartphone, Wrench } from "lucide-react";
import CodeBlock from "./CodeBlock";
import SecurityScope from "./SecurityScope";
import { LogoMark } from "./Logo";
import { Em, Kicker, Title, WRAP, richTags } from "./ui";
import { CODE_CS, CODE_SQL } from "@/lib/code-samples";
import { projects } from "@/lib/projects";

type Pillar = { href: string; title: string; text: string };
type DevService = { icon: keyof typeof ICONS; title: string; text: string; tags: string[] };
type Point = { title: string; text: string };
type Stock = { product: string; qty: number };
type SecService = { tag: string; title: string; text: string };
type Severity = "critical" | "medium" | "low";
type Finding = { sev: Severity; id: string; title: string; status: "fixed" | "inProgress" };
type Step = { title: string; text: string };

const ICONS = { globe: Globe, phone: Smartphone, monitor: Monitor, plug: Plug, cloud: Cloud, wrench: Wrench };

/* ------------------------------------------------------------------ */
/* Servicios: presentación de la marca + tres pilares                   */
/* ------------------------------------------------------------------ */
export function Intro() {
  const t = useTranslations("intro");
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <section id="servicios" className="bg-white py-24 sm:py-32">
      <div className={WRAP}>
        <div data-reveal className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <Kicker>{t("kicker")}</Kicker>
            <div className="mb-8 text-neutral-950">
              <LogoMark size={72} />
            </div>
            <p className="text-5xl leading-[0.95] text-neutral-950 sm:text-7xl md:text-8xl" style={{ letterSpacing: "-0.07em" }}>
              <Em>Cornerstone</Em>
              <br />
              Develop
            </p>
          </div>
          <div className="max-w-md text-lg leading-relaxed text-neutral-600">
            <p>{t("body")}</p>
            <p className="mt-4 text-base text-neutral-800">{t("who")}</p>
            <p className="mt-5 border-t border-neutral-200 pt-5 text-sm text-neutral-500">{t("symbol")}</p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <a
              key={p.href}
              href={p.href}
              data-reveal
              className="group flex min-h-[260px] flex-col rounded-3xl border border-neutral-200 bg-neutral-50 p-7 transition-all hover:-translate-y-1 hover:border-neutral-950 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-neutral-500">0{i + 1}</span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-neutral-950 text-white transition-colors group-hover:bg-signal group-hover:text-neutral-950">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-auto text-2xl font-medium text-neutral-950" style={{ letterSpacing: "-0.04em" }}>
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{p.text}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 01 · Desarrollo                                                      */
/* ------------------------------------------------------------------ */
export function Development() {
  const t = useTranslations("dev");
  const services = t.raw("services") as DevService[];

  return (
    <section id="desarrollo" className="bg-neutral-100 py-24 sm:py-32">
      <div className={WRAP}>
        <div data-reveal className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Kicker>{t("kicker")}</Kicker>
            <Title>{t.rich("title", richTags)}</Title>
          </div>
          <p className="max-w-md text-base leading-relaxed text-neutral-600 md:justify-self-end">{t("lead")}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div data-reveal className="min-w-0 lg:sticky lg:top-28">
            <CodeBlock filename="FacturaService.cs" lang="cs" code={CODE_CS} />
            <p className="mt-3 px-2 text-xs text-neutral-500">{t("codeCaption")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => {
              const Icon = ICONS[s.icon];
              return (
                <article key={s.title} data-reveal className="flex flex-col gap-3 rounded-3xl bg-white p-6">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-neutral-950 text-signal">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-semibold text-neutral-950" style={{ letterSpacing: "-0.03em" }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{s.text}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {s.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-neutral-200 px-2.5 py-1 text-[11px] text-neutral-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 02 · Datos                                                           */
/* ------------------------------------------------------------------ */
export function Data() {
  const t = useTranslations("data");
  const points = t.raw("points") as Point[];
  const stock = t.raw("stock") as Stock[];

  return (
    <section id="datos" className="bg-ink py-24 text-white sm:py-32">
      <div className={WRAP}>
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div data-reveal>
            <Kicker dark>{t("kicker")}</Kicker>
            <Title dark>{t.rich("title", richTags)}</Title>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/65">{t("lead")}</p>
            <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {points.map((d, i) => (
                <li key={d.title} className="flex gap-5 py-5">
                  <span className="font-mono text-xs text-signal">0{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{d.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{d.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-2">
              {["SQL Server", "PostgreSQL", "MySQL", "Power BI", "Entity Framework"].map((tech) => (
                <span key={tech} className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div data-reveal className="flex min-w-0 flex-col gap-4">
            <CodeBlock filename="stock_bajo.sql" lang="sql" code={CODE_SQL} />
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-4 flex items-center justify-between text-xs">
                <span className="font-medium text-white/80">{t("resultTitle")}</span>
                <span className="font-mono uppercase tracking-widest text-white/40">{t("sample")}</span>
              </div>
              <div className="flex flex-col gap-3">
                {stock.map((r) => (
                  <div key={r.product} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5">
                    <span className="truncate text-sm text-white/85">{r.product}</span>
                    <span className="font-mono text-sm tabular-nums text-signal">{r.qty}</span>
                    <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                      <span className="block h-full rounded-full bg-signal" style={{ width: `${(r.qty / 10) * 100}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 03 · Ciberseguridad                                                  */
/* ------------------------------------------------------------------ */
const SEV_STYLE: Record<Severity, string> = {
  critical: "bg-[#ff4d4d] text-neutral-950",
  medium: "bg-signal text-neutral-950",
  low: "bg-white/15 text-white",
};
const SEV_COUNT_STYLE: Record<Severity, string> = {
  critical: "text-[#ff4d4d]",
  medium: "text-signal",
  low: "text-white",
};

export function Security() {
  const t = useTranslations("security");
  const services = t.raw("services") as SecService[];
  const findings = t.raw("findings") as Finding[];
  const counts = (["critical", "medium", "low"] as Severity[]).map((sev) => ({
    sev,
    n: findings.filter((f) => f.sev === sev).length,
  }));

  return (
    <section id="seguridad" className="relative overflow-hidden bg-ink-2 py-24 text-white sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className={`relative ${WRAP}`}>
        <div data-reveal className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Kicker dark>{t("kicker")}</Kicker>
            <Title dark>{t.rich("title", richTags)}</Title>
          </div>
          <p className="max-w-md text-base leading-relaxed text-white/65 md:justify-self-end">{t("lead")}</p>
        </div>

        <SecurityScope
          lines={t.raw("scope.lines") as string[]}
          label={t("scope.label")}
          file={t("scope.file")}
          sample={t("scope.sample")}
          description={t("scope.description")}
        />

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <article key={s.title} data-reveal className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <span className="rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white/60">
                  {s.tag}
                </span>
                <h3 className="mt-5 text-lg font-semibold" style={{ letterSpacing: "-0.03em" }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
              </article>
            ))}
          </div>

          <div data-reveal className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-ink">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-xs">
              <span className="flex items-center gap-2 font-mono text-white/70">
                <ShieldAlert className="h-4 w-4 text-[#ff4d4d]" aria-hidden="true" />
                {t("report.file")}
              </span>
              <span className="font-mono uppercase tracking-widest text-white/40" title={t("report.sampleNote")}>
                {t("report.sample")}
              </span>
            </div>
            <div className="grid grid-cols-3 border-b border-white/10 text-center">
              {counts.map(({ sev, n }) => (
                <div key={sev} className="border-r border-white/10 py-6 last:border-r-0">
                  <div className={`font-playfair text-5xl ${SEV_COUNT_STYLE[sev]}`}>{n}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-widest text-white/50">{t(`severityPlural.${sev}`)}</div>
                </div>
              ))}
            </div>
            <ul className="divide-y divide-white/10">
              {findings.map((f) => (
                <li key={f.title} className="flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-4 text-sm">
                  <span className={`w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-[10px] font-semibold uppercase ${SEV_STYLE[f.sev]}`}>
                    {t(`severity.${f.sev}`)}
                  </span>
                  <span className="font-mono text-xs text-white/45">{f.id}</span>
                  <span className="min-w-0 flex-1 text-white/85">{f.title}</span>
                  <span className={`text-xs ${f.status === "fixed" ? "text-[#3ddc97]" : "text-signal"}`}>
                    ● {t(`status.${f.status}`)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-5">
              <div className="max-w-xs text-xs leading-relaxed text-white/55">
                <p>{t("report.footnote")}</p>
                <p className="mt-1 text-white/40">{t("report.sampleNote")}</p>
              </div>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-transform hover:scale-[1.03]"
              >
                {t("report.cta")} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 04 · Proyectos (productos desplegados)                               */
/* ------------------------------------------------------------------ */
export function Projects() {
  const t = useTranslations("projects");

  return (
    <section id="proyectos" className="bg-white py-24 sm:py-32">
      <div className={WRAP}>
        <div data-reveal className="mb-14 grid gap-6 md:grid-cols-2 md:items-end">
          <div>
            <Kicker>{t("kicker")}</Kicker>
            <Title>{t.rich("title", richTags)}</Title>
          </div>
          <p className="max-w-md text-base leading-relaxed text-neutral-600 md:justify-self-end">{t("lead")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p, i) => {
            const featured = i === 0;
            return (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                className={`group flex flex-col rounded-3xl p-6 transition-transform hover:-translate-y-1 sm:p-8 ${
                  featured ? "bg-signal text-neutral-950" : "bg-neutral-100 text-neutral-950"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-widest ${
                      featured ? "bg-neutral-950 text-signal" : "bg-white text-neutral-600"
                    }`}
                  >
                    {t(`items.${p.id}.tag`)}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-950 text-white transition-colors group-hover:bg-white group-hover:text-neutral-950">
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl bg-neutral-950 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
                  <div className="flex items-center gap-1.5 px-3 py-2" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="h-2 w-2 rounded-full bg-white/25" />
                    <span className="ml-2 truncate rounded-full bg-white/10 px-3 py-0.5 font-mono text-[10px] text-white/60">
                      {p.host}
                    </span>
                  </div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={t("previewAlt", { name: p.name })}
                      fill
                      sizes="(min-width: 768px) 560px, 100vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                </div>
                <h3
                  className="mt-8 font-playfair text-3xl leading-none sm:text-4xl"
                  style={{ letterSpacing: "-0.05em" }}
                >
                  {t(`items.${p.id}.title`)}
                </h3>
                <p className="mt-3 text-sm opacity-75">{t(`items.${p.id}.desc`)}</p>
                <p className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-4 text-xs">
                  <span className="font-mono opacity-70">{p.host}</span>
                  <span className="font-medium">
                    {t("visit")} <span className="sr-only">— {p.name}</span>
                  </span>
                </p>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 05 · Proceso                                                         */
/* ------------------------------------------------------------------ */
export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="proceso" className="bg-neutral-100 py-24 sm:py-32">
      <div className={WRAP}>
        <div data-reveal className="mb-14">
          <Kicker>{t("kicker")}</Kicker>
          <Title>{t.rich("title", richTags)}</Title>
        </div>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {steps.map((s, i) => {
            const highlight = i === 3; // the security audit step
            return (
              <li
                key={s.title}
                data-reveal
                className={`flex flex-col gap-3 rounded-3xl p-6 ${highlight ? "bg-neutral-950 text-white" : "bg-white text-neutral-950"}`}
              >
                <span className={`font-playfair text-4xl ${highlight ? "text-signal" : "text-neutral-400"}`}>{i + 1}</span>
                <h3 className="text-lg font-semibold" style={{ letterSpacing: "-0.03em" }}>
                  {s.title}
                </h3>
                <p className={`text-sm leading-relaxed ${highlight ? "text-white/65" : "text-neutral-600"}`}>{s.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

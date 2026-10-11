"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpRight, CalendarDays, Mail, MessageCircle } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from "@/lib/brand";
import { Link } from "@/i18n/navigation";
import { Kicker, WRAP, richTags } from "./ui";

type ToastType = "success" | "error";
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const removeToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => removeToast(id), 5000);
    },
    [removeToast]
  );
  return { toasts, addToast, removeToast };
}

const isConfigured = (val: string) => !val.includes("REPLACE_ME");

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-white/45 outline-none transition-colors focus:border-signal aria-[invalid=true]:border-[#ff4d4d]";

export default function Contact() {
  const t = useTranslations("contact");
  const { toasts, addToast, removeToast } = useToasts();
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const serviceOptions = t.raw("form.services") as string[];

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(1, t("form.errors.name")).max(100),
        email: z.string().trim().email(t("form.errors.email")).max(254),
        service: z.string().min(1, t("form.errors.service")),
        message: z.string().trim().min(20, t("form.errors.message")).max(5000),
        website: z.string().optional(),
        consent: z.boolean().refine((v) => v === true, t("form.consent_error")),
      }),
    [t]
  );
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { consent: false, service: "" } });

  const onSubmit = async (data: FormData) => {
    // Honeypot filled → silently drop (bots get a fake success).
    if (data.website) {
      reset();
      addToast("success", t("form.success"));
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 429) {
        addToast("error", t("form.rateLimited"));
        return;
      }
      if (!response.ok) throw new Error("Contact request failed");

      reset();
      addToast("success", t("form.success"));
    } catch {
      addToast("error", t("form.error"));
    } finally {
      setStatus("idle");
    }
  };

  const fieldError = (id: string, msg?: string) =>
    msg ? (
      <p id={id} className="mt-1.5 text-xs text-[#ff8080]">
        {msg}
      </p>
    ) : null;

  const a11y = (name: keyof FormData) =>
    errors[name]
      ? { "aria-invalid": true as const, "aria-describedby": `cf-${name}-err` }
      : {};

  return (
    <>
      {/* Toasts */}
      <div className="fixed bottom-24 right-6 z-[100] flex max-w-sm flex-col gap-3" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm text-white shadow-2xl ${
              toast.type === "success" ? "bg-ink" : "bg-[#450a0a]"
            }`}
          >
            <span aria-hidden="true" className={toast.type === "success" ? "text-signal" : "text-[#ff8080]"}>
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} aria-label={t("form.close")} className="opacity-70 hover:opacity-100">
              ✕
            </button>
          </div>
        ))}
      </div>

      <section id="contacto" className="bg-signal py-24 text-neutral-950 sm:py-32">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start`}>
          {/* Left: headline + direct channels */}
          <div data-reveal>
            <Kicker dot="bg-neutral-950">{t("kicker")}</Kicker>
            <h2 className="text-5xl leading-[0.95] sm:text-7xl md:text-8xl" style={{ letterSpacing: "-0.07em" }}>
              {t.rich("title", richTags)}
            </h2>
            <p className="mt-8 max-w-md text-base leading-relaxed text-neutral-800">{t("lead")}</p>
            <p className="mt-2 text-sm font-medium text-neutral-900">{t("response_time")}</p>

            <ul className="mt-10 grid gap-3 sm:max-w-md">
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-4 rounded-2xl bg-neutral-950/[0.06] px-5 py-4 transition-colors hover:bg-neutral-950/10"
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-widest text-neutral-700">{t("email_label")}</span>
                    <span className="block break-all text-sm font-semibold">{CONTACT_EMAIL}</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t("whatsapp_text"))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl bg-neutral-950/[0.06] px-5 py-4 transition-colors hover:bg-neutral-950/10"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="block text-[11px] uppercase tracking-widest text-neutral-700">{t("whatsapp_label")}</span>
                    <span className="block text-sm font-semibold">+593 96 073 0449</span>
                  </span>
                </a>
              </li>
              {isConfigured(CONFIG.calendly) && (
                <li>
                  <a
                    href={CONFIG.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl bg-neutral-950 px-5 py-4 text-white transition-transform hover:scale-[1.01]"
                  >
                    <CalendarDays className="h-5 w-5 shrink-0 text-signal" aria-hidden="true" />
                    <span className="flex-1 text-sm font-semibold">{t("calendly_label")}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Right: form */}
          <div data-reveal className="rounded-3xl bg-neutral-950 p-6 text-white sm:p-8">
            <p className="mb-6 text-[11px] uppercase tracking-widest text-white/55">{t("formTitle")}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col gap-4" noValidate>
              {/* Honeypot — hidden from humans and screen readers */}
              <input
                {...register("website")}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />

              <div>
                <label htmlFor="cf-name" className="sr-only">
                  {t("form.name")}
                </label>
                <input id="cf-name" {...register("name")} type="text" autoComplete="name" placeholder={t("form.name")} {...a11y("name")} className={inputClass} />
                {fieldError("cf-name-err", errors.name?.message)}
              </div>

              <div>
                <label htmlFor="cf-email" className="sr-only">
                  {t("form.email")}
                </label>
                <input id="cf-email" {...register("email")} type="email" autoComplete="email" placeholder={t("form.email")} {...a11y("email")} className={inputClass} />
                {fieldError("cf-email-err", errors.email?.message)}
              </div>

              <div>
                <label htmlFor="cf-service" className="sr-only">
                  {t("form.service")}
                </label>
                <select id="cf-service" {...register("service")} {...a11y("service")} className={`${inputClass} cursor-pointer [&>option]:text-neutral-950`}>
                  <option value="">{t("form.service")}</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {fieldError("cf-service-err", errors.service?.message)}
              </div>

              <div>
                <label htmlFor="cf-message" className="sr-only">
                  {t("form.message")}
                </label>
                <textarea id="cf-message" {...register("message")} rows={5} placeholder={t("form.message")} {...a11y("message")} className={`${inputClass} resize-y`} />
                {fieldError("cf-message-err", errors.message?.message)}
              </div>

              {/* Privacy consent (LOPDP: informed, explicit, never pre-ticked) */}
              <div>
                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-white/70">
                  <input {...register("consent")} type="checkbox" {...a11y("consent")} className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#f2c230]" />
                  <span>
                    {t.rich("form.consent", {
                      link: (chunks) => (
                        <Link href="/privacy" target="_blank" className="text-signal underline underline-offset-2">
                          {chunks}
                        </Link>
                      ),
                    })}
                  </span>
                </label>
                {fieldError("cf-consent-err", errors.consent?.message)}
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-ink transition-all hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("form.sending")}
                  </>
                ) : (
                  <>
                    {t("form.submit")} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

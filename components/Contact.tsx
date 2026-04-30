"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import { CONFIG } from "@/lib/config";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

type ToastType = "success" | "error";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

let toastId = 0;

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: number) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-3 rounded-xl px-4 py-3 shadow-2xl"
            style={{
              background: toast.type === "success" ? "#064e3b" : "#450a0a",
              border: `1px solid ${toast.type === "success" ? "#065f46" : "#7f1d1d"}`,
              color: "#fff",
            }}
          >
            <span className="text-lg shrink-0" aria-hidden="true">
              {toast.type === "success" ? "✓" : "✕"}
            </span>
            <span className="text-sm font-mono flex-1">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              aria-label="Close notification"
              className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 group"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
        style={{ background: "rgba(34,211,238,0.08)", border: "1px solid var(--border)" }}
      >
        <span style={{ color: "var(--accent)" }}>{icon}</span>
      </div>
      <div>
        <div className="text-xs font-mono tracking-widest uppercase mb-0.5" style={{ color: "var(--muted)" }}>
          {label}
        </div>
        <div
          className="text-sm font-mono group-hover:text-accent transition-colors duration-200"
          style={{ color: "var(--text)" }}
        >
          {value}
        </div>
      </div>
    </a>
  );
}

export default function Contact() {
  const t = useTranslations("contact");
  const { toasts, addToast, removeToast } = useToasts();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const serviceOptions = t.raw("form.services") as string[];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const isConfigured = (val: string) => val !== "REPLACE_ME";

  const sendWhatsApp = async (data: FormData) => {
    if (
      !isConfigured(CONFIG.callmebot.phone) ||
      !isConfigured(CONFIG.callmebot.apikey)
    )
      return;

    const text = encodeURIComponent(
      `📬 Nuevo lead!\n👤 ${data.name} (${data.email})\n🛠 ${data.service}\n💬 ${data.message.slice(0, 200)}`
    );
    const url = `https://api.callmebot.com/whatsapp.php?phone=${CONFIG.callmebot.phone}&text=${text}&apikey=${CONFIG.callmebot.apikey}`;

    try {
      await fetch(url, { mode: "no-cors" });
    } catch {
      // Fire and forget — ignore errors
    }
  };

  const onSubmit = async (data: FormData) => {
    setStatus("loading");

    try {
      if (
        isConfigured(CONFIG.emailjs.publicKey) &&
        isConfigured(CONFIG.emailjs.serviceId) &&
        isConfigured(CONFIG.emailjs.templateId)
      ) {
        await emailjs.send(
          CONFIG.emailjs.serviceId,
          CONFIG.emailjs.templateId,
          {
            name: data.name,
            email: data.email,
            message: `Service: ${data.service}\n\n${data.message}`,
            time: new Date().toLocaleString("es-EC", {
              timeZone: "America/Guayaquil",
              dateStyle: "long",
              timeStyle: "short",
            }),
          },
          CONFIG.emailjs.publicKey
        );
      }

      // Fire-and-forget WhatsApp
      sendWhatsApp(data);

      setStatus("success");
      reset();
      addToast("success", t("form.success"));
    } catch {
      setStatus("error");
      addToast("error", t("form.error"));
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const inputStyle = {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "0.5rem",
    fontFamily: "var(--font-jetbrains), monospace",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    padding: "0.75rem 1rem",
  };

  const errorStyle = { color: "var(--red)", fontSize: "0.75rem", marginTop: "0.25rem" };

  return (
    <>
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <section
        id="contact"
        className="py-24 px-6 md:px-12 lg:px-24"
        style={{ background: "var(--bg)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p
              className="text-xs font-mono font-semibold tracking-widest uppercase mb-3"
              style={{ color: "var(--accent)" }}
            >
              CONTACT
            </p>
            <h2
              className="text-5xl md:text-6xl font-display font-black uppercase mb-4"
              style={{ color: "var(--text)", fontFamily: "var(--font-barlow)" }}
            >
              {t("title")}
            </h2>
            <p className="text-base md:text-lg max-w-xl" style={{ color: "var(--muted)" }}>
              {t("subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-8"
            >
              <InfoItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
                label={t("email_label")}
                value="lui.alv.ron.25@gmail.com"
                href="mailto:lui.alv.ron.25@gmail.com"
              />

              <InfoItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                }
                label={t("whatsapp_label")}
                value="+593 96 073 0449"
                href="https://wa.me/593960730449?text=Hola%20David,%20me%20gustar%C3%ADa%20cotizar%20un%20proyecto"
              />

              <div className="flex flex-col gap-3">
                <a
                  href={CONFIG.calendly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 font-mono font-bold text-sm px-6 py-3 rounded transition-all duration-200"
                  style={{
                    background: "var(--accent)",
                    color: "#0b0d12",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent2)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)")}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {t("calendly_label")}
                </a>
                <InfoItem
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  }
                  label="Calendly"
                  value={t("calendly_label")}
                  href={CONFIG.calendly}
                />
              </div>

              <InfoItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                }
                label={t("github_label")}
                value={`github.com/${CONFIG.github.username}`}
                href={`https://github.com/${CONFIG.github.username}`}
              />

              <InfoItem
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                }
                label={t("linkedin_label")}
                value="linkedin.com/in/david-alvarado-ronquillo"
                href="https://linkedin.com/in/david-alvarado-ronquillo"
              />
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="mb-6 flex items-center gap-2">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-semibold"
                  style={{
                    background: "rgba(34,211,238,0.08)",
                    color: "var(--accent)",
                    border: "1px solid rgba(34,211,238,0.2)",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                  Respondo en menos de 24h
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
                {/* Name */}
                <div>
                  <input
                    {...register("name")}
                    type="text"
                    placeholder={t("form.name")}
                    style={inputStyle}
                    className="transition-colors duration-200"
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "var(--border)";
                    }}
                  />
                  {errors.name && (
                    <p style={errorStyle}>{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder={t("form.email")}
                    style={inputStyle}
                    className="transition-colors duration-200"
                    onFocus={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLInputElement).style.borderColor = "var(--border)";
                    }}
                  />
                  {errors.email && (
                    <p style={errorStyle}>{errors.email.message}</p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <select
                    {...register("service")}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onFocus={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLSelectElement).style.borderColor = "var(--border)";
                    }}
                  >
                    <option value="">{t("form.service")}</option>
                    {serviceOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p style={errorStyle}>{errors.service.message}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <textarea
                    {...register("message")}
                    placeholder={t("form.message")}
                    rows={5}
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLTextAreaElement).style.borderColor = "var(--border)";
                    }}
                  />
                  {errors.message && (
                    <p style={errorStyle}>{errors.message.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-3 font-mono font-bold text-sm px-8 py-3.5 rounded transition-all duration-200"
                  style={{
                    background: status === "loading" ? "rgba(34,211,238,0.6)" : "var(--accent)",
                    color: "#0b0d12",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--accent2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status !== "loading") {
                      (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
                    }
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      {t("form.sending")}
                    </>
                  ) : (
                    t("form.submit")
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

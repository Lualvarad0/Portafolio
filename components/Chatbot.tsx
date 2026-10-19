"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight, Calendar, MessageCircle, SendHorizontal, ShieldCheck, X } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { LogoMark } from "./Logo";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "greeting" | "scope" | "budget" | "low_budget" | "calendly" | "done";

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  showCalendly?: boolean;
}

interface LeadData {
  service?: string;
  scope?: string;
  budget?: string;
  email?: string;
}

interface ScopeEntry {
  q: string;
  chips: string[];
}

interface ScriptEntry {
  greetIntro: string;
  serviceChips: string[];
  scopeQ: Record<string, ScopeEntry>;
  budgetIntro: string;
  budgetChips: string[];
  lowBudget: string;
  highBudget: string;
  emailThanks: (email: string) => string;
  emailPlaceholder: string;
  submitEmail: string;
  typing: string;
  inputPlaceholder: string;
  inputDone: string;
  selectPrompt: string;
  invalidChoice: string;
  tooShort: string;
}

// ─── Scripted conversation ────────────────────────────────────────────────────

const SCRIPT: Record<"en" | "es", ScriptEntry> = {
  en: {
    greetIntro: "Hi! I'm Alex 👋 David's virtual (automated) assistant. Which service are you looking for?",
    serviceChips: ["Frontend", "Backend", "Security Audit", "Security Consulting", "Full Project"],
    scopeQ: {
      Frontend: { q: "Is this a new site / app or improving an existing one?", chips: ["New website", "New app", "Improve existing", "Not sure"] },
      Backend: { q: "Do you need a new API / backend or integrations with existing systems?", chips: ["New API", "Integrations", "Both", "Not sure"] },
      "Security Audit": { q: "What do you want audited?", chips: ["Web app", "Mobile app", "Infrastructure", "All"] },
      "Security Consulting": { q: "What type of consulting are you after?", chips: ["Ongoing advice", "One-time consult", "Compliance", "Not sure"] },
      "Full Project": { q: "Describe briefly what you want to build (at least 15 characters):", chips: [] },
    },
    budgetIntro: "Almost there! What's your rough budget for this project?",
    budgetChips: ["Under $500", "$500–$2,000", "$2,000–$5,000", "$5,000+", "Not sure yet"],
    lowBudget: "David focuses on larger projects, but leave your email and we'll reach out if something fits!",
    highBudget: "David would love to connect! Book a free 30-min discovery call below 👇",
    emailThanks: (email) => `Got it! We'll reach out to ${email} soon. David usually replies within 24h 🙌`,
    emailPlaceholder: "your@email.com",
    submitEmail: "Submit",
    typing: "Alex is typing...",
    inputPlaceholder: "Type your message...",
    inputDone: "Conversation ended",
    selectPrompt: "Type a number or tap an option to select.",
    invalidChoice: "Please pick one of the options below — type its number or tap it.",
    tooShort: "Could you tell me a bit more? At least 15 characters helps David understand your project. Give it another go:",
  },
  es: {
    greetIntro: "¡Hola! Soy Alex 👋 el asistente virtual (automatizado) de David. ¿Qué tipo de servicio buscas?",
    serviceChips: ["Frontend", "Backend", "Auditoría de Seguridad", "Consultoría de Seguridad", "Proyecto Completo"],
    scopeQ: {
      Frontend: { q: "¿Es un sitio / app nuevo o vas a mejorar uno existente?", chips: ["Sitio nuevo", "App nueva", "Mejorar existente", "No sé aún"] },
      Backend: { q: "¿Necesitas una API nueva o integraciones con sistemas existentes?", chips: ["Nueva API", "Integraciones", "Ambas", "No sé aún"] },
      "Auditoría de Seguridad": { q: "¿Qué quieres auditar?", chips: ["App web", "App móvil", "Infraestructura", "Todo"] },
      "Consultoría de Seguridad": { q: "¿Qué tipo de consultoría buscas?", chips: ["Asesoría continua", "Consulta única", "Cumplimiento", "No sé aún"] },
      "Proyecto Completo": { q: "Describe brevemente qué quieres construir (mínimo 15 caracteres):", chips: [] },
    },
    budgetIntro: "¡Casi listo! ¿Tienes un presupuesto aproximado en mente?",
    budgetChips: ["Menos de $500", "$500–$2,000", "$2,000–$5,000", "$5,000+", "No sé aún"],
    lowBudget: "David trabaja en proyectos medianos y grandes, pero deja tu correo y te avisamos si surge algo que encaje.",
    highBudget: "¡Genial! A David le encantaría conectar. Reserva una llamada gratuita de 30 min 👇",
    emailThanks: (email) => `¡Listo! Nos contactaremos a ${email} pronto. David normalmente responde en menos de 24h 🙌`,
    emailPlaceholder: "tu@email.com",
    submitEmail: "Enviar",
    typing: "Alex está escribiendo...",
    inputPlaceholder: "Escribe tu mensaje...",
    inputDone: "Conversación finalizada",
    selectPrompt: "Escribe un número o toca una opción para elegir.",
    invalidChoice: "Por favor elige una de las opciones de abajo: escribe su número o tócala.",
    tooShort: "¿Puedes contarme un poco más? Al menos 15 caracteres ayudan a David a entender tu proyecto. Inténtalo de nuevo:",
  },
};

const LOW_BUDGET = new Set(["Under $500", "Menos de $500"]);

// ─── General intent responses ─────────────────────────────────────────────────

const GENERAL: Record<"en" | "es", Record<string, string>> = {
  en: {
    // greet: prefix is prepended dynamically based on time of day
    greet:
      "👋 Great to meet you. I'm Alex — David Alvarado's virtual assistant. David is a Full Stack Developer & Security Engineer, and I'm here to help you figure out what you need and connect you with him.\n\nFeel free to ask me anything, or pick a service below to get started!",
    creator:
      "The creator of this page, David Alvarado, designed me to help you! 😄 I'm Alex — built by David so visitors like you can find the right service and connect with him easily. Pretty meta, right? What can I help you with?",
    about_alex:
      "I'm Alex, David's virtual assistant 🤖 I'm not David himself — I handle the first chat so David can focus on building great software. I can tell you about his services, his work, or help you figure out your next project. What do you need?",
    page:
      "This is David Alvarado's portfolio 💻 He's a Full Stack Developer & Security Engineer from Guayaquil, Ecuador. He builds robust web apps with security baked in from day one — then audits them to keep them that way. Explore his Services, Projects, and Security Labs on the page!",
    owner:
      "David Alvarado is a Full Stack Developer and Security Engineer based in Guayaquil, Ecuador 🇪🇨 He specializes in React/Next.js frontends, Node.js/NestJS backends, cloud infrastructure (AWS, Docker), and web security audits following OWASP Top 10. Want to know about his services?",
    services:
      "David offers 5 services:\n\n1. Frontend Dev — React, Next.js, TypeScript\n2. Backend & APIs — Node.js, NestJS, .NET\n3. DevOps & Cloud — Docker, AWS, CI/CD\n4. Security Audit — OWASP pentest + report\n5. Security Consulting — threat modeling, code review\n\nPick one below or type a number!",
  },
  es: {
    // greet: prefijo agregado dinámicamente según la hora del día
    greet:
      "👋 Mucho gusto. Soy Alex — el asistente virtual de David Alvarado. David es Desarrollador Full Stack e Ingeniero de Seguridad, y estoy aquí para ayudarte a entender qué necesitas y conectarte con él.\n\n¡Pregúntame lo que quieras o elige un servicio abajo para empezar!",
    creator:
      "¡El creador de esta página, David Alvarado, me diseñó para ayudarte! 😄 Soy Alex — David me construyó para que visitantes como tú puedan encontrar el servicio correcto y conectarse con él fácilmente. Bastante meta, ¿no? ¿En qué te puedo ayudar?",
    about_alex:
      "Soy Alex, el asistente virtual de David 🤖 No soy David — me encargo del primer chat para que él pueda concentrarse en construir software de calidad. Puedo contarte sobre sus servicios, su trabajo o ayudarte a definir tu próximo proyecto. ¿Qué necesitas?",
    page:
      "Este es el portafolio de David Alvarado 💻 Es un Desarrollador Full Stack e Ingeniero de Seguridad de Guayaquil, Ecuador. Construye apps web robustas con seguridad integrada desde el primer día — y luego las audita para mantenerlas así. ¡Explora sus Servicios, Proyectos y Labs de Seguridad en la página!",
    owner:
      "David Alvarado es un Desarrollador Full Stack e Ingeniero de Seguridad de Guayaquil, Ecuador 🇪🇨 Se especializa en frontends con React/Next.js, backends con Node.js/NestJS, infraestructura cloud (AWS, Docker) y auditorías de seguridad web siguiendo OWASP Top 10. ¿Quieres saber sobre sus servicios?",
    services:
      "David ofrece 5 servicios:\n\n1. Desarrollo Frontend — React, Next.js, TypeScript\n2. Backend y APIs — Node.js, NestJS, .NET\n3. DevOps y Cloud — Docker, AWS, CI/CD\n4. Auditoría de Seguridad — pentest OWASP + reporte\n5. Consultoría de Seguridad — threat modeling, revisión de código\n\n¡Elige uno abajo o escribe un número!",
  },
};

function detectGeneralIntent(
  text: string
): "greet" | "creator" | "about_alex" | "page" | "owner" | "services" | null {
  const t = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

  // Specific intents first so they don't get swallowed by greet
  if (
    /(de que trata|trata la pagina|de que va|sobre que es|que es esta pagina|que es el portafolio|portafolio|portfolio|page|website|sitio web|this site|this page|what is this|what'?s this about)/.test(t)
  )
    return "page";

  if (
    /(dueno|owner|david alvarado|quien es david|who is david|quien hizo (la pagina|el sitio)|sobre david|acerca de david)/.test(t)
  )
    return "owner";

  if (
    /(servicios|services|que ofrece|que hace david|what does david|what do you offer|que puedes hacer|what can you do|offer|provide|precios|pricing|cuanto cuesta|how much)/.test(t)
  )
    return "services";

  // Who created Alex
  if (
    /(quien te creo|quien te hizo|quien te diseño|quien te programo|who created you|who made you|who built you|who designed you|your creator|tu creador|te creo|te hizo|te diseño|te programo)/.test(t)
  )
    return "creator";

  // Alex identity
  if (
    /(quien eres|que eres|eres un bot|eres ia|eres una ia|are you (a |an )?(bot|ai|robot|human|real)|who are you|what are you|eres real|eres humano|como funciona[sz]?)/.test(t)
  )
    return "about_alex";

  // Greeting: matches any message that starts with a greeting word
  if (
    /^(hola|hello|hi|hey|buenas|buenos|saludos|greetings|good (morning|afternoon|evening|day)|sup|what'?s up|howdy|yo |salut|ciao|ola |que tal|como (estas|andas|va)|que hay)\b/.test(t)
  )
    return "greet";

  return null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function resolveChoice(input: string, options: string[]): string | null {
  const trimmed = input.trim();
  if (options.includes(trimmed)) return trimmed;
  const lower = trimmed.toLowerCase();
  const caseMatch = options.find((o) => o.toLowerCase() === lower);
  if (caseMatch) return caseMatch;
  const n = parseInt(trimmed, 10);
  if (!isNaN(n) && n >= 1 && n <= options.length) return options[n - 1];
  return null;
}

function timeGreeting(lang: "en" | "es"): string {
  const h = new Date().getHours();
  if (lang === "es") {
    if (h >= 6 && h < 12) return "¡Buenos días!";
    if (h >= 12 && h < 19) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  }
  if (h >= 6 && h < 12) return "Good morning!";
  if (h >= 12 && h < 18) return "Good afternoon!";
  return "Good evening!";
}

function buildTranscript(msgs: ChatMessage[]): string {
  return msgs
    .filter((m) => m.content)
    .map((m) => `[${m.role === "bot" ? "Alex" : "Cliente"}]: ${m.content}`)
    .join("\n");
}

function notifyLead(lead: LeadData, transcript: string): void {
  fetch("/api/chat/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, summary: transcript.slice(-6000) }),
  }).catch(() => {});
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BotAvatar({ size = 28 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-ink"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <LogoMark size={Math.round(size * 0.36)} color="#ffffff" />
    </span>
  );
}

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-500"
          style={{ animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function CalendlyCard({ locale }: { locale: string }) {
  const label =
    locale === "es"
      ? "Agenda tu llamada gratuita de 30 min"
      : "Book your free 30-min call";
  const btnLabel = locale === "es" ? "Agendar ahora" : "Schedule now";

  return (
    <div className="mt-2 ml-9 max-w-[85%] rounded-2xl bg-ink p-4 text-white">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Calendar className="h-4 w-4 text-signal" aria-hidden="true" />
        {label}
      </div>
      <a
        href={CONFIG.calendly}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-signal px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-signal-dark"
      >
        {btnLabel} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Chatbot() {
  const locale = useLocale();
  const lang = locale === "es" ? "es" : "en";
  const s = SCRIPT[lang];
  const tChat = useTranslations("chat");

  const [isOpen, setIsOpen] = useState(false);
  const [hasNotif, setHasNotif] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<Step>("greeting");
  const [chips, setChips] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [greeted, setGreeted] = useState(false);

  // Refs to avoid stale closures in async callbacks
  const msgsRef = useRef<ChatMessage[]>([]);
  const leadRef = useRef<LeadData>({});
  const stepRef = useRef<Step>("greeting");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const setMsgs = (msgs: ChatMessage[]) => {
    msgsRef.current = msgs;
    setMessages(msgs);
  };

  const setLead = (lead: LeadData) => {
    leadRef.current = lead;
  };

  const setCurrentStep = (s: Step) => {
    stepRef.current = s;
    setStep(s);
  };

  // Auto-scroll on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, chips]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen && !isTyping) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isTyping]);

  // Simulate bot typing then append message
  const botReply = (
    content: string,
    currentMsgs: ChatMessage[],
    opts: {
      chips?: string[];
      showCalendly?: boolean;
      showEmail?: boolean;
      nextStep?: Step;
    } = {}
  ): Promise<ChatMessage[]> => {
    setIsTyping(true);
    setChips([]);

    return new Promise<ChatMessage[]>((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        const msg: ChatMessage = {
          id: uid(),
          role: "bot",
          content,
          timestamp: new Date(),
          showCalendly: opts.showCalendly,
        };
        const next = [...currentMsgs, msg];
        setMsgs(next);
        if (opts.chips?.length) setChips(opts.chips);
        if (opts.showEmail) setShowEmailInput(true);
        if (opts.nextStep) setCurrentStep(opts.nextStep);
        resolve(next);
      }, 700);
    });
  };

  const triggerGreeting = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const msg: ChatMessage = {
        id: uid(),
        role: "bot",
        content: `${s.greetIntro}\n\n${s.selectPrompt}`,
        timestamp: new Date(),
      };
      setMsgs([msg]);
      setChips([...s.serviceChips]);
      setCurrentStep("greeting");
    }, 700);
  };

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasNotif(false);
        if (!greeted) {
          setGreeted(true);
          setTimeout(() => triggerGreeting(), 150);
        }
      }
      return next;
    });
  };

  const handleUserMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    const savedChips = [...chips];
    setInputValue("");
    setChips([]);

    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    const withUser = [...msgsRef.current, userMsg];
    setMsgs(withUser);

    const currentStep = stepRef.current;

    // Handle general questions without advancing the flow
    if (currentStep !== "done" && currentStep !== "calendly") {
      const intent = detectGeneralIntent(content);
      if (intent) {
        let response = GENERAL[lang][intent];
        // Prepend time-aware greeting
        if (intent === "greet") response = `${timeGreeting(lang)} ${response}`;
        const fallbackChips = savedChips.length > 0 ? savedChips : [...s.serviceChips];
        await botReply(response, withUser, { chips: fallbackChips });
        return;
      }
    }

    if (currentStep === "greeting") {
      // Require a valid service selection (by chip text or number)
      const resolved = resolveChoice(content, s.serviceChips);
      if (!resolved) {
        const chips2 = savedChips.length > 0 ? savedChips : [...s.serviceChips];
        await botReply(
          s.invalidChoice,
          withUser,
          { chips: chips2 }
        );
        return;
      }
      const newLead = { ...leadRef.current, service: resolved };
      setLead(newLead);
      const scopeEntry: ScopeEntry =
        s.scopeQ[resolved] ?? s.scopeQ["Full Project"] ?? s.scopeQ["Proyecto Completo"];
      const scopeMsg =
        scopeEntry.chips.length > 0
          ? `${scopeEntry.q}\n\n${s.selectPrompt}`
          : scopeEntry.q;
      await botReply(scopeMsg, withUser, {
        chips: [...scopeEntry.chips],
        nextStep: "scope",
      });
    } else if (currentStep === "scope") {
      const currentService = leadRef.current.service ?? "";
      const scopeEntry =
        s.scopeQ[currentService] ?? s.scopeQ["Full Project"] ?? s.scopeQ["Proyecto Completo"];

      let resolvedScope: string;
      if (scopeEntry.chips.length > 0) {
        // Selection from a list → require valid number or chip
        const resolved = resolveChoice(content, scopeEntry.chips);
        if (!resolved) {
          const chips2 = savedChips.length > 0 ? savedChips : [...scopeEntry.chips];
          await botReply(
            s.invalidChoice,
            withUser,
            { chips: chips2 }
          );
          return;
        }
        resolvedScope = resolved;
      } else {
        // Free text (Full Project) → require minimum length
        if (content.trim().length < 15) {
          await botReply(s.tooShort, withUser, {});
          return;
        }
        resolvedScope = content.trim();
      }

      const newLead = { ...leadRef.current, scope: resolvedScope };
      setLead(newLead);
      const budgetMsg = `${s.budgetIntro}\n\n${s.selectPrompt}`;
      await botReply(budgetMsg, withUser, {
        chips: [...s.budgetChips],
        nextStep: "budget",
      });
    } else if (currentStep === "budget") {
      // Require a valid budget selection (by chip text or number)
      const resolved = resolveChoice(content, s.budgetChips);
      if (!resolved) {
        const chips2 = savedChips.length > 0 ? savedChips : [...s.budgetChips];
        await botReply(
          s.invalidChoice,
          withUser,
          { chips: chips2 }
        );
        return;
      }
      const newLead = { ...leadRef.current, budget: resolved };
      setLead(newLead);

      if (LOW_BUDGET.has(resolved)) {
        await botReply(s.lowBudget, withUser, {
          showEmail: true,
          nextStep: "low_budget",
        });
      } else {
        const finalMsgs = await botReply(s.highBudget, withUser, {
          showCalendly: true,
          nextStep: "calendly",
        });
        notifyLead(newLead, buildTranscript(finalMsgs));
      }
    }
  };

  const handleSubmitEmail = async () => {
    if (!emailValue.trim()) return;
    const email = emailValue.trim();
    const newLead = { ...leadRef.current, email };
    setLead(newLead);
    setShowEmailInput(false);
    setEmailValue("");

    const finalMsgs = await botReply(s.emailThanks(email), msgsRef.current, {
      nextStep: "done",
    });
    notifyLead(newLead, buildTranscript(finalMsgs));
  };

  const isDone = step === "calendly" || step === "done";
  const canSend = !!inputValue.trim() && !isTyping && !isDone;

  return (
    <>
      {/* Keyframe injection */}
      <style>{`
        @keyframes chatDot {
          0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatMsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(242,194,48,0.45); }
          50% { box-shadow: 0 0 0 10px rgba(242,194,48,0); }
        }
        .chat-msg { animation: chatMsgIn 0.25s ease-out; }
        .chat-panel {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 392px;
          height: min(600px, calc(100dvh - 120px));
          border-radius: 24px;
          z-index: 9999;
        }
        .chat-backdrop {
          display: none;
        }
        /* Mobile: full-width bottom sheet that shrinks with keyboard (dvh) */
        @media (max-width: 640px) {
          .chat-panel {
            width: 100%;
            right: 0;
            left: 0;
            bottom: 0;
            height: 88dvh;
            max-height: 100dvh;
            border-radius: 24px 24px 0 0;
          }
          .chat-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.55);
            z-index: 9998;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
          }
          /* The sheet covers the bottom of the screen: the FAB would sit on top of
             the send button and swallow the tap. Close via header ✕ or backdrop. */
          .chat-fab[data-open="true"] {
            display: none !important;
          }
          /* Prevent iOS auto-zoom on input focus (font must be >= 16px) */
          .chat-input {
            font-size: 16px !important;
          }
          /* Bottom safe-area so input isn't under home indicator */
          .chat-input-area {
            padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .chat-msg, .chat-panel { animation: none !important; }
        }
      `}</style>

      {/* ── Mobile backdrop (tap outside to close) ────────────────── */}
      {isOpen && (
        <div
          className="chat-backdrop"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat assistant"
          className="chat-panel flex flex-col overflow-hidden bg-white font-sans text-neutral-900 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] ring-1 ring-black/5"
          style={{ animation: "chatSlideUp 0.22s ease-out" }}
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 bg-ink px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="relative">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                  <LogoMark size={14} color="#ffffff" />
                </span>
                <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-ink bg-emerald-400" />
              </span>
              <div>
                <div className="text-sm font-semibold">
                  {locale === "es" ? "Alex · Asistente virtual" : "Alex · Virtual assistant"}
                </div>
                <div className="mt-0.5 text-xs text-white/60">
                  {locale === "es" ? "Cornerstone Develop · Respondo en segundos" : "Cornerstone Develop · Replies in seconds"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Privacy notice — shown before the visitor types anything */}
          <div className="flex shrink-0 items-start gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-2.5 text-[11px] leading-snug text-neutral-500">
            <ShieldCheck className="mt-px h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
            <span>
              {tChat.rich("notice", {
                link: (chunks) => (
                  <Link href="/privacy" target="_blank" className="font-medium text-neutral-800 underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </span>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(0,0,0,0.15) transparent",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {messages.map((msg, i) => {
              const isUser = msg.role === "user";
              // Group consecutive bot messages: avatar only on the last one of a run
              const showAvatar = !isUser && messages[i + 1]?.role !== "bot";
              return (
                <div key={msg.id} className="chat-msg">
                  <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (showAvatar ? <BotAvatar /> : <span className="w-7 shrink-0" />)}
                    <div
                      className={`max-w-[80%] whitespace-pre-wrap break-words px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-2xl rounded-br-md bg-ink text-white"
                          : "rounded-2xl rounded-bl-md bg-neutral-100 text-neutral-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  <div className={`mt-1 text-[10px] text-neutral-400 ${isUser ? "text-right" : "pl-9"}`}>
                    {formatTime(msg.timestamp)}
                  </div>

                  {msg.showCalendly && <CalendlyCard locale={locale} />}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-msg flex items-end gap-2">
                <BotAvatar />
                <TypingDots />
              </div>
            )}

            {/* Quick reply options (also selectable by typing their number) */}
            {chips.length > 0 && !isTyping && (
              <div className="chat-msg ml-9 flex flex-col gap-2">
                {chips.map((chip, idx) => (
                  <button
                    key={chip}
                    onClick={() => handleUserMessage(chip)}
                    className="group flex min-h-11 items-center gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-left text-sm font-medium text-neutral-800 transition-colors hover:border-ink hover:bg-ink hover:text-white"
                    style={{ touchAction: "manipulation" }}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-neutral-100 font-mono text-[11px] text-neutral-500 transition-colors group-hover:bg-signal group-hover:text-ink">
                      {idx + 1}
                    </span>
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input area */}
          {showEmailInput ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitEmail();
              }}
              className="chat-input-area flex shrink-0 gap-2 border-t border-neutral-100 bg-white px-4 py-3"
            >
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                enterKeyHint="send"
                autoComplete="email"
                placeholder={s.emailPlaceholder}
                className="chat-input min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-ink focus:bg-white"
              />
              <button
                type="submit"
                disabled={!emailValue.trim()}
                className="shrink-0 rounded-full bg-ink px-5 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                {s.submitEmail}
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserMessage(inputValue);
              }}
              className="chat-input-area flex shrink-0 items-center gap-2 border-t border-neutral-100 bg-white px-4 py-3"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                enterKeyHint="send"
                disabled={isTyping || isDone}
                placeholder={
                  isDone ? s.inputDone : isTyping ? s.typing : s.inputPlaceholder
                }
                className="chat-input min-w-0 flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-ink focus:bg-white disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!canSend}
                aria-label="Send message"
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition-colors ${
                  canSend ? "bg-signal text-ink hover:bg-signal-dark" : "cursor-not-allowed bg-neutral-100 text-neutral-400"
                }`}
                style={{ touchAction: "manipulation" }}
              >
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── FAB ───────────────────────────────────────────────────────── */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`chat-fab fixed right-6 bottom-6 z-[10000] grid h-14 w-14 place-items-center rounded-full transition-all duration-200 hover:scale-105 ${
          isOpen
            ? "bg-ink text-white shadow-lg ring-1 ring-white/10"
            : "bg-signal text-ink shadow-[0_10px_30px_-6px_rgba(242,194,48,0.6)]"
        }`}
        data-open={isOpen ? "true" : undefined}
        style={{
          touchAction: "manipulation",
          animation: hasNotif && !isOpen ? "chatPulse 2.4s ease-in-out infinite" : undefined,
        }}
      >
        {isOpen ? (
          <X className="h-5 w-5" aria-hidden="true" />
        ) : (
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
        )}

        {hasNotif && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-white bg-rose-500 text-[10px] font-bold text-white">
            1
          </span>
        )}
      </button>
    </>
  );
}

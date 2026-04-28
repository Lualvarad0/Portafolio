"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { CONFIG } from "@/lib/config";

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
    greetIntro: "Hi! I'm Alex 👋 I'm David's assistant. Which service are you looking for?",
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
    emailThanks: (email) => `Got it! We'll reach out to ${email} soon. David will be in touch within 24h 🙌`,
    emailPlaceholder: "your@email.com",
    submitEmail: "Submit",
    typing: "Alex is typing...",
    inputPlaceholder: "Type your message...",
    inputDone: "Conversation ended",
    selectPrompt: "Type a number or tap an option to select.",
    invalidChoice: "Please pick one of the options — type a number or tap a chip:",
    tooShort: "Could you tell me a bit more? At least 15 characters helps David understand your project. Give it another go:",
  },
  es: {
    greetIntro: "¡Hola! Soy Alex 👋 el asistente de David. ¿Qué tipo de servicio buscas?",
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
    emailThanks: (email) => `¡Listo! Nos contactaremos a ${email} pronto. David estará en contacto en menos de 24h 🙌`,
    emailPlaceholder: "tu@email.com",
    submitEmail: "Enviar",
    typing: "Alex está escribiendo...",
    inputPlaceholder: "Escribe tu mensaje...",
    inputDone: "Conversación finalizada",
    selectPrompt: "Escribe un número o toca una opción para elegir.",
    invalidChoice: "Por favor elige una de las opciones — escribe un número o toca un chip:",
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

function numberedList(items: string[]): string {
  return items.map((item, i) => `${i + 1}. ${item}`).join("\n");
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
    body: JSON.stringify({ ...lead, summary: transcript }),
  }).catch(() => {});
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div
      style={{
        background: "#181c26",
        borderLeft: "2px solid #22d3ee",
        padding: "8px 12px",
        borderRadius: 2,
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#22d3ee",
            display: "inline-block",
            animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
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
  const btnLabel = locale === "es" ? "Agendar ahora →" : "Schedule now →";

  return (
    <div
      style={{
        border: "1px solid var(--accent)",
        borderRadius: 2,
        padding: "10px 12px",
        marginTop: 8,
        background: "rgba(34,211,238,0.05)",
      }}
    >
      <div
        style={{
          fontSize: "0.72rem",
          color: "var(--accent)",
          fontFamily: "var(--font-jetbrains), monospace",
          marginBottom: 8,
          letterSpacing: "0.06em",
        }}
      >
        📅 {label}
      </div>
      <a
        href={CONFIG.calendly}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          background: "var(--accent)",
          color: "#0b0d12",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "0.72rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          padding: "6px 14px",
          borderRadius: 2,
          textDecoration: "none",
        }}
      >
        {btnLabel}
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Chatbot() {
  const locale = useLocale();
  const lang = locale === "es" ? "es" : "en";
  const s = SCRIPT[lang];

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
      const list = numberedList(s.serviceChips);
      const msg: ChatMessage = {
        id: uid(),
        role: "bot",
        content: `${s.greetIntro}\n\n${list}\n\n${s.selectPrompt}`,
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
          `${s.invalidChoice}\n\n${numberedList(s.serviceChips)}`,
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
          ? `${scopeEntry.q}\n\n${numberedList(scopeEntry.chips)}\n\n${s.selectPrompt}`
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
            `${s.invalidChoice}\n\n${numberedList(scopeEntry.chips)}`,
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
      const budgetMsg = `${s.budgetIntro}\n\n${numberedList(s.budgetChips)}\n\n${s.selectPrompt}`;
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
          `${s.invalidChoice}\n\n${numberedList(s.budgetChips)}`,
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
        @keyframes chatPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,211,238,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(34,211,238,0); }
        }
        .chat-panel {
          position: fixed;
          bottom: 90px;
          right: 24px;
          width: 380px;
          height: 520px;
          border-radius: 2px;
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
            height: 85dvh;
            max-height: 100dvh;
            border-radius: 18px 18px 0 0;
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
          /* Prevent iOS auto-zoom on input focus (font must be >= 16px) */
          .chat-input {
            font-size: 16px !important;
          }
          /* Bigger touch targets for chips */
          .chat-chip {
            min-height: 38px !important;
            padding: 8px 14px !important;
            font-size: 0.78rem !important;
          }
          /* Bottom safe-area so input isn't under home indicator */
          .chat-input-area {
            padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px)) !important;
          }
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
          className="chat-panel"
          style={{
            background: "#0b0d12",
            border: "1px solid rgba(34,211,238,0.22)",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            boxShadow:
              "0 24px 80px rgba(0,0,0,0.7), 0 0 40px rgba(34,211,238,0.04)",
            animation: "chatSlideUp 0.22s ease-out",
            fontFamily: "var(--font-jetbrains), monospace",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "#10131a",
              borderBottom: "1px solid rgba(34,211,238,0.12)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22d3ee",
                  display: "inline-block",
                  animation: "chatPulse 2s ease-in-out infinite",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "#d4dce8",
                    letterSpacing: "0.04em",
                  }}
                >
                  // Alex — Assistant
                </div>
                <div style={{ fontSize: "0.66rem", color: "#5a6478", marginTop: 1 }}>
                  {locale === "es" ? "Respondo en segundos" : "I respond in seconds"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              style={{
                background: "none",
                border: "none",
                color: "#5a6478",
                cursor: "pointer",
                fontSize: "1rem",
                lineHeight: 1,
                padding: 4,
                borderRadius: 2,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#d4dce8")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#5a6478")
              }
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(34,211,238,0.15) transparent",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "8px 10px",
                      borderRadius: 2,
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      ...(msg.role === "user"
                        ? {
                            background: "#22d3ee",
                            color: "#0b0d12",
                            fontWeight: 500,
                          }
                        : {
                            background: "#181c26",
                            color: "#d4dce8",
                            borderLeft: "2px solid #22d3ee",
                          }),
                    }}
                  >
                    {msg.content}
                  </div>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      color: "#5a6478",
                      marginTop: 3,
                      letterSpacing: "0.04em",
                    }}
                  >
                    {formatTime(msg.timestamp)}
                  </span>
                </div>

                {msg.showCalendly && <CalendlyCard locale={locale} />}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <TypingDots />
              </div>
            )}

            {/* Quick reply chips */}
            {chips.length > 0 && !isTyping && (
              <div
                style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}
              >
                {chips.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleUserMessage(chip)}
                    className="chat-chip"
                    style={{
                      background: "transparent",
                      border: "1px solid rgba(34,211,238,0.5)",
                      color: "#22d3ee",
                      fontFamily: "var(--font-jetbrains), monospace",
                      fontSize: "0.72rem",
                      padding: "4px 10px",
                      borderRadius: 2,
                      cursor: "pointer",
                      letterSpacing: "0.04em",
                      transition: "background 0.15s",
                      touchAction: "manipulation",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "rgba(34,211,238,0.1)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLButtonElement).style.background =
                        "transparent")
                    }
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input area */}
          {showEmailInput ? (
            <div
              className="chat-input-area"
              style={{
                borderTop: "1px solid rgba(34,211,238,0.12)",
                padding: "10px 14px",
                background: "#10131a",
                display: "flex",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitEmail()}
                placeholder={s.emailPlaceholder}
                className="chat-input"
                style={{
                  flex: 1,
                  background: "#0b0d12",
                  border: "1px solid rgba(34,211,238,0.2)",
                  color: "#d4dce8",
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "0.82rem",
                  padding: "8px 10px",
                  borderRadius: 2,
                  outline: "none",
                }}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor = "#22d3ee")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "rgba(34,211,238,0.2)")
                }
              />
              <button
                onClick={handleSubmitEmail}
                disabled={!emailValue.trim()}
                style={{
                  background: "#22d3ee",
                  color: "#0b0d12",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 2,
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: emailValue.trim() ? "pointer" : "not-allowed",
                  opacity: emailValue.trim() ? 1 : 0.5,
                }}
              >
                {s.submitEmail}
              </button>
            </div>
          ) : (
            <div
              className="chat-input-area"
              style={{
                borderTop: "1px solid rgba(34,211,238,0.12)",
                padding: "10px 14px",
                background: "#10131a",
                display: "flex",
                gap: 8,
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleUserMessage(inputValue);
                  }
                }}
                disabled={isTyping || isDone}
                placeholder={
                  isDone ? s.inputDone : isTyping ? s.typing : s.inputPlaceholder
                }
                className="chat-input"
                style={{
                  flex: 1,
                  background: "#0b0d12",
                  border: "1px solid rgba(34,211,238,0.2)",
                  color: "#d4dce8",
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "0.82rem",
                  padding: "8px 10px",
                  borderRadius: 0,
                  outline: "none",
                  opacity: isTyping || isDone ? 0.5 : 1,
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  if (!isTyping && !isDone)
                    (e.target as HTMLInputElement).style.borderColor = "#22d3ee";
                }}
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "rgba(34,211,238,0.2)")
                }
              />
              <button
                onClick={() => handleUserMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping || isDone}
                aria-label="Send message"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background:
                    inputValue.trim() && !isTyping && !isDone
                      ? "#22d3ee"
                      : "rgba(34,211,238,0.15)",
                  border: "none",
                  touchAction: "manipulation",
                  cursor:
                    inputValue.trim() && !isTyping && !isDone
                      ? "pointer"
                      : "not-allowed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={
                    inputValue.trim() && !isTyping && !isDone
                      ? "#0b0d12"
                      : "#22d3ee"
                  }
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── FAB ───────────────────────────────────────────────────────── */}
      <button
        onClick={handleToggle}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: isOpen ? "#10131a" : "#22d3ee",
          border: isOpen ? "1px solid rgba(34,211,238,0.4)" : "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10000,
          touchAction: "manipulation",
          boxShadow: isOpen
            ? "none"
            : "0 8px 32px rgba(34,211,238,0.35), 0 2px 8px rgba(0,0,0,0.4)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isOpen)
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
        }}
      >
        {isOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0b0d12"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}

        {hasNotif && !isOpen && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#f43f5e",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-jetbrains), monospace",
              border: "2px solid #0b0d12",
            }}
          >
            1
          </span>
        )}
      </button>
    </>
  );
}

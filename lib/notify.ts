// Server-only: never import this from a client component — it reads secrets.

export interface LeadData {
  service?: string;
  scope?: string;
  budget?: string;
  email?: string;
  summary: string;
}

export interface ContactData {
  name: string;
  email: string;
  service: string;
  message: string;
}

// Email delivery must run after the API guard, never directly in the browser.
export async function sendContactEmail(data: ContactData): Promise<void> {
  const publicKey = process.env.EMAILJS_PUBLIC_KEY || process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
  const serviceId = process.env.EMAILJS_SERVICE_ID || process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  if (![publicKey, serviceId, templateId].every((value) => value && !value.includes("REPLACE_ME"))) {
    if (process.env.CALLMEBOT_PHONE && process.env.CALLMEBOT_APIKEY) return;
    throw new Error("No contact delivery channel configured");
  }
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(8000),
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        ...data,
        from_name: data.name,
        from_email: data.email,
        message: `Service: ${data.service}\n\n${data.message}`,
        time: new Date().toLocaleString("es-EC", {
          timeZone: "America/Guayaquil", dateStyle: "long", timeStyle: "short",
        }),
      },
    }),
  });
  if (!response.ok) throw new Error(`Email delivery failed: ${response.status}`);
}

// CallMeBot sends the text in a GET query string; keep it well under URL limits.
const MAX_MESSAGE_CHARS = 1500;

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

async function sendWhatsApp(message: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apikey) {
    console.warn("[notify] CALLMEBOT_PHONE / CALLMEBOT_APIKEY not set — skipping WhatsApp notification");
    return;
  }

  const params = new URLSearchParams({
    phone,
    text: truncate(message, MAX_MESSAGE_CHARS),
    apikey,
  });

  try {
    const res = await fetch(`https://api.callmebot.com/whatsapp.php?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[notify] CallMeBot responded ${res.status}`);
  } catch (error) {
    console.error("[notify] CallMeBot request failed", error);
  }
}

export function notifyLead(lead: LeadData): Promise<void> {
  return sendWhatsApp(
    [
      "🤖 Nuevo lead desde el chatbot!",
      `🛠 Servicio: ${lead.service || "No especificado"}`,
      `📋 Alcance: ${lead.scope || "No especificado"}`,
      `💰 Presupuesto: ${lead.budget || "No especificado"}`,
      `📧 Email: ${lead.email || "No recolectado"}`,
      ``,
      `💬 Conversación:`,
      lead.summary,
    ].join("\n")
  );
}

export function notifyContact(data: ContactData): Promise<void> {
  return sendWhatsApp(
    [
      "📬 Nuevo lead desde el formulario!",
      `👤 ${data.name} (${data.email})`,
      `🛠 ${data.service}`,
      `💬 ${truncate(data.message, 600)}`,
    ].join("\n")
  );
}

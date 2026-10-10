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

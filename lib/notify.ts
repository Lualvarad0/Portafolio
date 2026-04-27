export interface LeadData {
  service?: string;
  scope?: string;
  budget?: string;
  email?: string;
  summary: string;
}

export async function notifyWhatsApp(lead: LeadData): Promise<void> {
  const phone = process.env.NEXT_PUBLIC_CALLMEBOT_PHONE;
  const apikey = process.env.NEXT_PUBLIC_CALLMEBOT_APIKEY;

  if (!phone || !apikey || phone === "REPLACE_ME" || apikey === "REPLACE_ME") {
    return;
  }

  const message = [
    "🤖 Nuevo lead desde el chatbot!",
    `🛠 Servicio: ${lead.service || "No especificado"}`,
    `📋 Alcance: ${lead.scope || "No especificado"}`,
    `💰 Presupuesto: ${lead.budget || "No especificado"}`,
    `📧 Email: ${lead.email || "No recolectado"}`,
    ``,
    `💬 Conversación:`,
    lead.summary,
  ].join("\n");

  const text = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${text}&apikey=${apikey}`;

  try {
    await fetch(url);
  } catch {
    // Fire and forget — ignore errors
  }
}

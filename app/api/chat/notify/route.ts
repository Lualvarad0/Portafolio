import { notifyWhatsApp, type LeadData } from "@/lib/notify";

export async function POST(request: Request) {
  try {
    const lead = (await request.json()) as LeadData;
    await notifyWhatsApp(lead);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

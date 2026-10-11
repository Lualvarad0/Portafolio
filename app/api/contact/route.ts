import { notifyContact, sendContactEmail } from "@/lib/notify";
import { guardRequest } from "@/lib/api-guard";
import { contactSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const guard = await guardRequest(request, "contact");
  if ("error" in guard) return guard.error;

  const parsed = contactSchema.safeParse(guard.body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { website, ...data } = parsed.data;
  // Honeypot filled → pretend success so bots don't retry.
  if (website) return Response.json({ ok: true });

  try {
    await sendContactEmail(data);
    await notifyContact(data);
  } catch {
    return Response.json({ error: "Delivery failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}

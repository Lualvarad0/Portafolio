import { notifyLead } from "@/lib/notify";
import { guardRequest } from "@/lib/api-guard";
import { leadSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const guard = await guardRequest(request, "chat");
  if ("error" in guard) return guard.error;

  const parsed = leadSchema.safeParse(guard.body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  await notifyLead(parsed.data);
  return Response.json({ ok: true });
}

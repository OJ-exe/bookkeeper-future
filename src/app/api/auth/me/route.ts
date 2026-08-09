import { ok, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Not authenticated.");
  }

  return ok({
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company ?? null,
  });
}

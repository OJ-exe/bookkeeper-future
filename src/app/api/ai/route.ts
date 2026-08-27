import { NextResponse } from "next/server";
import { getAiSuggestion } from "@/lib/dashboardApi";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { unauthorized } from "@/lib/server/response";

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }

  const body = (await request.json().catch(() => ({}))) as { prompt?: string };
  const prompt = body.prompt || "Summarize the latest accounting activity.";

  return NextResponse.json(await getAiSuggestion(prompt));
}

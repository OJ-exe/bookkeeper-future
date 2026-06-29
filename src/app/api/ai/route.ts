import { NextResponse } from "next/server";
import { getAiSuggestion } from "@/lib/dashboardApi";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { prompt?: string };
  const prompt = body.prompt || "Summarize the latest accounting activity.";

  return NextResponse.json(await getAiSuggestion(prompt));
}

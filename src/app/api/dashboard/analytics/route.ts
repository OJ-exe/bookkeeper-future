import { NextResponse } from "next/server";
import { getDashboardAnalytics } from "@/lib/server/dashboardService";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { unauthorized } from "@/lib/server/response";

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }

  return NextResponse.json(await getDashboardAnalytics(user.id));
}

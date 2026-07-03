import { NextResponse } from "next/server";
import { getDashboardAnalytics } from "@/lib/server/dashboardService";

export async function GET() {
  return NextResponse.json(await getDashboardAnalytics());
}

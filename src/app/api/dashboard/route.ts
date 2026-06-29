import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/dashboardApi";

export async function GET() {
  return NextResponse.json(await getDashboardSummary());
}

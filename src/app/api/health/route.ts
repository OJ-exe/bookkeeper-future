import { NextResponse } from "next/server";
import { getHealthStatus } from "@/lib/dashboardApi";

export async function GET() {
  return NextResponse.json(await getHealthStatus());
}

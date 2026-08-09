import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/server/sessionService";

export async function POST(request: Request) {
  const token = request.cookies.get("sessionToken")?.value;
  if (token) {
    await deleteSession(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("sessionToken", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

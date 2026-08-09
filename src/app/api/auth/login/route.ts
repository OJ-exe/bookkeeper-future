import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/server/authService";
import { createSession } from "@/lib/server/sessionService";
import { authLoginSchema, parseValidation } from "@/lib/server/validation";
import { badRequest, unauthorized } from "@/lib/server/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(authLoginSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const user = await authenticateUser(parsed.data.email, parsed.data.password);
    if (!user) {
      return unauthorized("Email or password is invalid.");
    }

    const session = await createSession(user.id);
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company ?? null,
      },
    });

    response.cookies.set("sessionToken", session.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Login failed", error);
    return badRequest("Unable to authenticate.");
  }
}

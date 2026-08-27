import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export async function createSession(userId: number) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  return prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
}

export async function getSessionByToken(token: string) {
  return prisma.session.findFirst({
    where: { token, expiresAt: { gt: new Date() } },
    include: { user: true },
  });
}

export async function deleteSession(token: string) {
  return prisma.session.deleteMany({ where: { token } });
}

export async function getUserFromRequest(_request: Request) {
  const token = (await cookies()).get("sessionToken")?.value;
  if (!token) {
    return null;
  }

  const session = await getSessionByToken(token);
  return session?.user ?? null;
}

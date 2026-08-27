import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

const SALT_BYTES = 16;
const HASH_BYTES = 64;



export function hashPassword(password: string) {
  const salt = randomBytes(SALT_BYTES).toString("hex");

  const derivedKey = scryptSync(password, salt, HASH_BYTES, {
    N: 2 ** 14,
    r: 8,
    p: 1,
  });

  return `${salt}:${derivedKey.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;

  try {
    const derivedKey = scryptSync(password, salt, HASH_BYTES, {
      N: 2 ** 14,
      r: 8,
      p: 1,
    });

    const storedKey = Buffer.from(key, "hex");

    if (storedKey.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, storedKey);
  } catch {
    return false;
  }
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  company?: string | null;
}) {
  const passwordHash = hashPassword(input.password);
  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      company: input.company ?? null,
    },
  });
}

export async function authenticateUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) return null;
  if (!user.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}

export function normalizeUser(user: Pick<User, "id" | "name" | "email" | "company">) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company ?? null,
  };
}

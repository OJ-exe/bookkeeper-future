import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

export type ApiErrorBody = {
  error: string;
  details?: Record<string, string[]>;
};

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function created<T>(data: T) {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(error: string, details?: Record<string, string[]>) {
  return NextResponse.json({ error, details }, { status: 400 });
}

export function notFound(error: string) {
  return NextResponse.json({ error }, { status: 404 });
}

export function unauthorized(error: string) {
  return NextResponse.json({ error }, { status: 401 });
}

export function serverError(error: string) {
  return NextResponse.json({ error }, { status: 500 });
}

export function conflict(error: string) {
  return NextResponse.json({ error }, { status: 409 });
}

/**
 * True when the error is a Prisma unique-constraint violation (P2002),
 * e.g. a duplicate email/code/number scoped to the current user.
 */
export function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

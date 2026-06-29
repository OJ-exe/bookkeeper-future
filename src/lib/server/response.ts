import { NextResponse } from "next/server";

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

export function serverError(error: string) {
  return NextResponse.json({ error }, { status: 500 });
}

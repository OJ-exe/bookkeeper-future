import { NextResponse } from "next/server";
import { createVendor, getVendors } from "@/lib/server/vendorService";
import { badRequest, created, ok, serverError, unauthorized, conflict, isUniqueConstraintError } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { parseValidation, vendorCreateSchema } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const vendors = await getVendors(user.id);
    return ok(vendors);
  } catch (error) {
    console.error("Failed to list vendors", error);
    return serverError("Unable to fetch vendors.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(vendorCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const vendor = await createVendor(user.id, parsed.data);
    return created(vendor);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A vendor with this email already exists.");
    }
    console.error("Failed to create vendor", error);
    return serverError("Unable to create vendor.");
  }
}

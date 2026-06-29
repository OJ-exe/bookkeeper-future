import { NextResponse } from "next/server";
import { createVendor, listVendors } from "@/lib/server/vendorService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { parseValidation, vendorCreateSchema } from "@/lib/server/validation";

export async function GET() {
  try {
    const vendors = await listVendors();
    return ok(vendors);
  } catch (error) {
    console.error("Failed to list vendors", error);
    return serverError("Unable to fetch vendors.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(vendorCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const vendor = await createVendor(parsed.data);
    return created(vendor);
  } catch (error) {
    console.error("Failed to create vendor", error);
    return serverError("Unable to create vendor.");
  }
}

import { NextResponse } from "next/server";
import { deleteVendor, updateVendor } from "@/lib/server/vendorService";
import { badRequest, notFound, ok, serverError } from "@/lib/server/response";
import { parseValidation, vendorUpdateSchema } from "@/lib/server/validation";

function getId(url: URL) {
  const id = Number(url.pathname.split("/").pop());
  return Number.isFinite(id) ? id : null;
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vendorId = Number(id);

    if (!Number.isFinite(vendorId)) {
      return badRequest("Invalid vendor id.");
    }

    const body = await request.json();
    const parsed = parseValidation(vendorUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const vendor = await updateVendor(vendorId, parsed.data);
    if (!vendor) {
      return notFound("Vendor not found.");
    }

    return ok(vendor);
  } catch (error) {
    console.error("Failed to update vendor", error);
    return serverError("Unable to update vendor.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vendorId = Number(id);

    if (!Number.isFinite(vendorId)) {
      return badRequest("Invalid vendor id.");
    }

    const deleted = await deleteVendor(vendorId);
    if (!deleted) {
      return notFound("Vendor not found.");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete vendor", error);
    return serverError("Unable to delete vendor.");
  }
}

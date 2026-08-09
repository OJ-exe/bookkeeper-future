import { deleteBill, getBill, updateBill } from "@/lib/server/billService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { billUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const billId = Number(id);

    if (!Number.isFinite(billId)) {
      return badRequest("Invalid bill id.");
    }

    const bill = await getBill(billId);
    if (!bill) {
      return notFound("Bill not found.");
    }

    return ok(bill);
  } catch (error) {
    console.error("Failed to fetch bill", error);
    return serverError("Unable to fetch bill.");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const billId = Number(id);

    if (!Number.isFinite(billId)) {
      return badRequest("Invalid bill id.");
    }

    const body = await request.json();
    const parsed = parseValidation(billUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const bill = await updateBill(billId, parsed.data);
    if (!bill) {
      return notFound("Bill not found.");
    }

    return ok(bill);
  } catch (error) {
    console.error("Failed to update bill", error);
    return serverError("Unable to update bill.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const billId = Number(id);

    if (!Number.isFinite(billId)) {
      return badRequest("Invalid bill id.");
    }

    const deleted = await deleteBill(billId);
    if (!deleted) {
      return notFound("Bill not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete bill", error);
    return serverError("Unable to delete bill.");
  }
}

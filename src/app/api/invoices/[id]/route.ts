import { deleteInvoice, updateInvoice } from "@/lib/server/invoiceService";
import { badRequest, notFound, ok, serverError, unauthorized, conflict, isUniqueConstraintError } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { invoiceUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const invoiceId = Number(id);

    if (!Number.isFinite(invoiceId)) {
      return badRequest("Invalid invoice id.");
    }

    const body = await request.json();
    const parsed = parseValidation(invoiceUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const invoice = await updateInvoice(user.id, invoiceId, parsed.data);
    if (!invoice) {
      return notFound("Invoice not found.");
    }

    return ok(invoice);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A invoice with this number already exists.");
    }
    console.error("Failed to update invoice", error);
    return serverError("Unable to update invoice.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const invoiceId = Number(id);

    if (!Number.isFinite(invoiceId)) {
      return badRequest("Invalid invoice id.");
    }

    const deleted = await deleteInvoice(user.id, invoiceId);
    if (!deleted) {
      return notFound("Invoice not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete invoice", error);
    return serverError("Unable to delete invoice.");
  }
}

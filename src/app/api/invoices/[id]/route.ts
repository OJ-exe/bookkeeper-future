import { deleteInvoice, updateInvoice } from "@/lib/server/invoiceService";
import { badRequest, notFound, ok, serverError } from "@/lib/server/response";
import { invoiceUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const invoice = await updateInvoice(invoiceId, parsed.data);
    if (!invoice) {
      return notFound("Invoice not found.");
    }

    return ok(invoice);
  } catch (error) {
    console.error("Failed to update invoice", error);
    return serverError("Unable to update invoice.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const invoiceId = Number(id);

    if (!Number.isFinite(invoiceId)) {
      return badRequest("Invalid invoice id.");
    }

    const deleted = await deleteInvoice(invoiceId);
    if (!deleted) {
      return notFound("Invoice not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete invoice", error);
    return serverError("Unable to delete invoice.");
  }
}

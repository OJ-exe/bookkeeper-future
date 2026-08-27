import { createInvoice, listInvoices } from "@/lib/server/invoiceService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { invoiceCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const invoices = await listInvoices(user.id);
    return ok(invoices);
  } catch (error) {
    console.error("Failed to list invoices", error);
    return serverError("Unable to fetch invoices.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(invoiceCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const invoice = await createInvoice(user.id, parsed.data);
    return created(invoice);
  } catch (error) {
    console.error("Failed to create invoice", error);
    return serverError("Unable to create invoice.");
  }
}

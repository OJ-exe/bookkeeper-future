import { createInvoice, listInvoices } from "@/lib/server/invoiceService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { invoiceCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET() {
  try {
    const invoices = await listInvoices();
    return ok(invoices);
  } catch (error) {
    console.error("Failed to list invoices", error);
    return serverError("Unable to fetch invoices.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(invoiceCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const invoice = await createInvoice(parsed.data);
    return created(invoice);
  } catch (error) {
    console.error("Failed to create invoice", error);
    return serverError("Unable to create invoice.");
  }
}

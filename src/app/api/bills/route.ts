import { createBill, listBills } from "@/lib/server/billService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { billCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET() {
  try {
    const bills = await listBills();
    return ok(bills);
  } catch (error) {
    console.error("Failed to list bills", error);
    return serverError("Unable to fetch bills.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(billCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const bill = await createBill(parsed.data);
    return created(bill);
  } catch (error) {
    console.error("Failed to create bill", error);
    return serverError("Unable to create bill.");
  }
}

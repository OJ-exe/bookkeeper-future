import { createBill, listBills } from "@/lib/server/billService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { billCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const bills = await listBills(user.id);
    return ok(bills);
  } catch (error) {
    console.error("Failed to list bills", error);
    return serverError("Unable to fetch bills.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(billCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const bill = await createBill(user.id, parsed.data);
    return created(bill);
  } catch (error) {
    console.error("Failed to create bill", error);
    return serverError("Unable to create bill.");
  }
}

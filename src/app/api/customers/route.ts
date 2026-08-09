import { getUserFromRequest } from "@/lib/server/sessionService";
import { createCustomer, listCustomers } from "@/lib/server/customerService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { customerCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }

    const customers = await listCustomers(user.id);
    return ok(customers);
  } catch (error) {
    console.error("Failed to list customers", error);
    return serverError("Unable to fetch customers.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }

    const body = await request.json();
    const parsed = parseValidation(customerCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const customer = await createCustomer(user.id, parsed.data);
    return created(customer);
  } catch (error) {
    console.error("Failed to create customer", error);
    return serverError("Unable to create customer.");
  }
}

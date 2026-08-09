import { createPayment, listPayments } from "@/lib/server/paymentService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { parseValidation, paymentCreateSchema } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const payments = await listPayments();
    return ok(payments);
  } catch (error) {
    console.error("Failed to list payments", error);
    return serverError("Unable to fetch payments.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(paymentCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const payment = await createPayment(parsed.data);
    return created(payment);
  } catch (error) {
    console.error("Failed to create payment", error);
    return serverError("Unable to create payment.");
  }
}

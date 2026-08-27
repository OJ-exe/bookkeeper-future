import { createOrder, getOrders } from "@/lib/server/orderService";
import { badRequest, created, ok, serverError, unauthorized, conflict, isUniqueConstraintError } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { orderCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const orders = await getOrders(user.id);
    return ok(orders);
  } catch (error) {
    console.error("Failed to list orders", error);
    return serverError("Unable to fetch orders.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(orderCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const order = await createOrder(user.id, parsed.data);
    return created(order);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A order with this number already exists.");
    }
    console.error("Failed to create order", error);
    return serverError("Unable to create order.");
  }
}

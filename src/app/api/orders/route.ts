import { createOrder, listOrders } from "@/lib/server/orderService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { orderCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET() {
  try {
    const orders = await listOrders();
    return ok(orders);
  } catch (error) {
    console.error("Failed to list orders", error);
    return serverError("Unable to fetch orders.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(orderCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const order = await createOrder(parsed.data);
    return created(order);
  } catch (error) {
    console.error("Failed to create order", error);
    return serverError("Unable to create order.");
  }
}

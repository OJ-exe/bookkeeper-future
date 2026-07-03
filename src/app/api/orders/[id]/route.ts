import { deleteOrder, updateOrder } from "@/lib/server/orderService";
import { badRequest, notFound, ok, serverError } from "@/lib/server/response";
import { orderUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isFinite(orderId)) {
      return badRequest("Invalid order id.");
    }

    const body = await request.json();
    const parsed = parseValidation(orderUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const order = await updateOrder(orderId, parsed.data);
    if (!order) {
      return notFound("Order not found.");
    }

    return ok(order);
  } catch (error) {
    console.error("Failed to update order", error);
    return serverError("Unable to update order.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (!Number.isFinite(orderId)) {
      return badRequest("Invalid order id.");
    }

    const deleted = await deleteOrder(orderId);
    if (!deleted) {
      return notFound("Order not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete order", error);
    return serverError("Unable to delete order.");
  }
}

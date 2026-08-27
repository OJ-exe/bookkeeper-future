import { deletePayment, getPayment, updatePayment } from "@/lib/server/paymentService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { parseValidation, paymentUpdateSchema } from "@/lib/server/validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const paymentId = Number(id);

    if (!Number.isFinite(paymentId)) {
      return badRequest("Invalid payment id.");
    }

    const payment = await getPayment(user.id, paymentId);
    if (!payment) {
      return notFound("Payment not found.");
    }

    return ok(payment);
  } catch (error) {
    console.error("Failed to fetch payment", error);
    return serverError("Unable to fetch payment.");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const paymentId = Number(id);

    if (!Number.isFinite(paymentId)) {
      return badRequest("Invalid payment id.");
    }

    const body = await request.json();
    const parsed = parseValidation(paymentUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const payment = await updatePayment(user.id, paymentId, parsed.data);
    if (!payment) {
      return notFound("Payment not found.");
    }

    return ok(payment);
  } catch (error) {
    console.error("Failed to update payment", error);
    return serverError("Unable to update payment.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const paymentId = Number(id);

    if (!Number.isFinite(paymentId)) {
      return badRequest("Invalid payment id.");
    }

    const deleted = await deletePayment(user.id, paymentId);
    if (!deleted) {
      return notFound("Payment not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete payment", error);
    return serverError("Unable to delete payment.");
  }
}

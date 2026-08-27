import { deleteCustomer, updateCustomer } from "@/lib/server/customerService";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { badRequest, notFound, ok, serverError, unauthorized, conflict, isUniqueConstraintError } from "@/lib/server/response";
import { customerUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }

    const { id } = await params;
    const customerId = Number(id);
    if (!Number.isFinite(customerId)) {
      return badRequest("Invalid customer id.");
    }

    const body = await request.json();
    const parsed = parseValidation(customerUpdateSchema, body);
    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const customer = await updateCustomer(user.id, customerId, parsed.data);
    if (!customer) {
      return notFound("Customer not found.");
    }

    return ok(customer);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A customer with this email already exists.");
    }
    console.error("Failed to update customer", error);
    return serverError("Unable to update customer.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }

    const { id } = await params;
    const customerId = Number(id);
    if (!Number.isFinite(customerId)) {
      return badRequest("Invalid customer id.");
    }

    const deleted = await deleteCustomer(user.id, customerId);
    if (!deleted) {
      return notFound("Customer not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete customer", error);
    return serverError("Unable to delete customer.");
  }
}

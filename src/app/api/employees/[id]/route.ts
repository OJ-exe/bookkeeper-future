import { deleteEmployee, updateEmployee } from "@/lib/server/employeeService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { employeeUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const employeeId = Number(id);

    if (!Number.isFinite(employeeId)) {
      return badRequest("Invalid employee id.");
    }

    const body = await request.json();
    const parsed = parseValidation(employeeUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const employee = await updateEmployee(employeeId, parsed.data);
    if (!employee) {
      return notFound("Employee not found.");
    }

    return ok(employee);
  } catch (error) {
    console.error("Failed to update employee", error);
    return serverError("Unable to update employee.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const employeeId = Number(id);

    if (!Number.isFinite(employeeId)) {
      return badRequest("Invalid employee id.");
    }

    const deleted = await deleteEmployee(employeeId);
    if (!deleted) {
      return notFound("Employee not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete employee", error);
    return serverError("Unable to delete employee.");
  }
}

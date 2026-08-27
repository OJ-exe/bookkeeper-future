import { deletePayrollRun, updatePayrollRun } from "@/lib/server/payrollService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { payrollUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;

    const body = await request.json();
    const parsed = parseValidation(payrollUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const payrollRun = await updatePayrollRun(user.id, id, parsed.data);
    if (!payrollRun) {
      return notFound("Payroll run not found.");
    }

    return ok(payrollRun);
  } catch (error) {
    console.error("Failed to update payroll run", error);
    return serverError("Unable to update payroll run.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;

    const deleted = await deletePayrollRun(user.id, id);
    if (!deleted) {
      return notFound("Payroll run not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete payroll run", error);
    return serverError("Unable to delete payroll run.");
  }
}

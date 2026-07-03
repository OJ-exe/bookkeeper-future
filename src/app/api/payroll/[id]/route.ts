import { deletePayrollRun, updatePayrollRun } from "@/lib/server/payrollService";
import { badRequest, notFound, ok, serverError } from "@/lib/server/response";
import { payrollUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const body = await request.json();
    const parsed = parseValidation(payrollUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const payrollRun = await updatePayrollRun(id, parsed.data);
    if (!payrollRun) {
      return notFound("Payroll run not found.");
    }

    return ok(payrollRun);
  } catch (error) {
    console.error("Failed to update payroll run", error);
    return serverError("Unable to update payroll run.");
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const deleted = await deletePayrollRun(id);
    if (!deleted) {
      return notFound("Payroll run not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete payroll run", error);
    return serverError("Unable to delete payroll run.");
  }
}

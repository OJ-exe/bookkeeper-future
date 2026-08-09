import { createPayrollRun, listPayrollRuns } from "@/lib/server/payrollService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { payrollCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const payrollRuns = await listPayrollRuns();
    return ok(payrollRuns);
  } catch (error) {
    console.error("Failed to list payroll runs", error);
    return serverError("Unable to fetch payroll runs.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(payrollCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const payrollRun = await createPayrollRun(parsed.data);
    return created(payrollRun);
  } catch (error) {
    console.error("Failed to create payroll run", error);
    return serverError("Unable to create payroll run.");
  }
}

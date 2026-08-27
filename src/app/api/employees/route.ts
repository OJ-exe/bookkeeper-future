import { createEmployee, getEmployees } from "@/lib/server/employeeService";
import { badRequest, created, ok, serverError, unauthorized, conflict, isUniqueConstraintError } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { employeeCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const employees = await getEmployees(user.id);
    return ok(employees);
  } catch (error) {
    console.error("Failed to list employees", error);
    return serverError("Unable to fetch employees.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(employeeCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const employee = await createEmployee(user.id, parsed.data);
    return created(employee);
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return conflict("A employee with this code already exists.");
    }
    console.error("Failed to create employee", error);
    return serverError("Unable to create employee.");
  }
}

import { createEmployee, listEmployees } from "@/lib/server/employeeService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { employeeCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET() {
  try {
    const employees = await listEmployees();
    return ok(employees);
  } catch (error) {
    console.error("Failed to list employees", error);
    return serverError("Unable to fetch employees.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(employeeCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const employee = await createEmployee(parsed.data);
    return created(employee);
  } catch (error) {
    console.error("Failed to create employee", error);
    return serverError("Unable to create employee.");
  }
}

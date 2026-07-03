import { createAccount, listAccounts } from "@/lib/server/accountService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { accountCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET() {
  try {
    const accounts = await listAccounts();
    return ok(accounts);
  } catch (error) {
    console.error("Failed to list accounts", error);
    return serverError("Unable to fetch accounts.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(accountCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const account = await createAccount(parsed.data);
    return created(account);
  } catch (error) {
    console.error("Failed to create account", error);
    return serverError("Unable to create account.");
  }
}

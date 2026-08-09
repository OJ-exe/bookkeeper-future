import { createAccount, listAccounts } from "@/lib/server/accountService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { accountCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const accounts = await listAccounts();
    return ok(accounts);
  } catch (error) {
    console.error("Failed to list accounts", error);
    return serverError("Unable to fetch accounts.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
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

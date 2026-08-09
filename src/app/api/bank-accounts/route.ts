import { createBankAccount, listBankAccounts } from "@/lib/server/bankingService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { bankAccountCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const accounts = await listBankAccounts();
    return ok(accounts);
  } catch (error) {
    console.error("Failed to list bank accounts", error);
    return serverError("Unable to fetch bank accounts.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(bankAccountCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const account = await createBankAccount(parsed.data);
    return created(account);
  } catch (error) {
    console.error("Failed to create bank account", error);
    return serverError("Unable to create bank account.");
  }
}

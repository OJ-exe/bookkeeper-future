import { createBankTransaction, listBankTransactions } from "@/lib/server/bankingService";
import { badRequest, created, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { bankTransactionCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const transactions = await listBankTransactions(user.id);
    return ok(transactions);
  } catch (error) {
    console.error("Failed to list transactions", error);
    return serverError("Unable to fetch transactions.");
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return unauthorized("Authentication required.");
    }
    const body = await request.json();
    const parsed = parseValidation(bankTransactionCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const transaction = await createBankTransaction(user.id, parsed.data);
    return created(transaction);
  } catch (error) {
    console.error("Failed to create transaction", error);
    return serverError("Unable to create transaction.");
  }
}

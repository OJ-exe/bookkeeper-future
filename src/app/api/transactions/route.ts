import { createBankTransaction, listBankTransactions } from "@/lib/server/bankingService";
import { badRequest, created, ok, serverError } from "@/lib/server/response";
import { bankTransactionCreateSchema, parseValidation } from "@/lib/server/validation";

export async function GET() {
  try {
    const transactions = await listBankTransactions();
    return ok(transactions);
  } catch (error) {
    console.error("Failed to list transactions", error);
    return serverError("Unable to fetch transactions.");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = parseValidation(bankTransactionCreateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const transaction = await createBankTransaction(parsed.data);
    return created(transaction);
  } catch (error) {
    console.error("Failed to create transaction", error);
    return serverError("Unable to create transaction.");
  }
}

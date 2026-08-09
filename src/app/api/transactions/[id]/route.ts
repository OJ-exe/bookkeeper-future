import { deleteBankTransaction, getBankTransaction, updateBankTransaction } from "@/lib/server/bankingService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { bankTransactionUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const transactionId = Number(id);

    if (!Number.isFinite(transactionId)) {
      return badRequest("Invalid transaction id.");
    }

    const transaction = await getBankTransaction(transactionId);
    if (!transaction) {
      return notFound("Transaction not found.");
    }

    return ok(transaction);
  } catch (error) {
    console.error("Failed to fetch transaction", error);
    return serverError("Unable to fetch transaction.");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const transactionId = Number(id);

    if (!Number.isFinite(transactionId)) {
      return badRequest("Invalid transaction id.");
    }

    const body = await request.json();
    const parsed = parseValidation(bankTransactionUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const transaction = await updateBankTransaction(transactionId, parsed.data);
    if (!transaction) {
      return notFound("Transaction not found.");
    }

    return ok(transaction);
  } catch (error) {
    console.error("Failed to update transaction", error);
    return serverError("Unable to update transaction.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const transactionId = Number(id);

    if (!Number.isFinite(transactionId)) {
      return badRequest("Invalid transaction id.");
    }

    const deleted = await deleteBankTransaction(transactionId);
    if (!deleted) {
      return notFound("Transaction not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete transaction", error);
    return serverError("Unable to delete transaction.");
  }
}

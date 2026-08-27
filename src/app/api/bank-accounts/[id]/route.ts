import { deleteBankAccount, getBankAccount, updateBankAccount } from "@/lib/server/bankingService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { bankAccountUpdateSchema, parseValidation } from "@/lib/server/validation";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const accountId = Number(id);

    if (!Number.isFinite(accountId)) {
      return badRequest("Invalid bank account id.");
    }

    const account = await getBankAccount(user.id, accountId);
    if (!account) {
      return notFound("Bank account not found.");
    }

    return ok(account);
  } catch (error) {
    console.error("Failed to fetch bank account", error);
    return serverError("Unable to fetch bank account.");
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const accountId = Number(id);

    if (!Number.isFinite(accountId)) {
      return badRequest("Invalid bank account id.");
    }

    const body = await request.json();
    const parsed = parseValidation(bankAccountUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const account = await updateBankAccount(user.id, accountId, parsed.data);
    if (!account) {
      return notFound("Bank account not found.");
    }

    return ok(account);
  } catch (error) {
    console.error("Failed to update bank account", error);
    return serverError("Unable to update bank account.");
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return unauthorized("Authentication required.");
  }
  try {
    const { id } = await params;
    const accountId = Number(id);

    if (!Number.isFinite(accountId)) {
      return badRequest("Invalid bank account id.");
    }

    const deleted = await deleteBankAccount(user.id, accountId);
    if (!deleted) {
      return notFound("Bank account not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete bank account", error);
    return serverError("Unable to delete bank account.");
  }
}

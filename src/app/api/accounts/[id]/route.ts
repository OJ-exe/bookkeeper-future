import { deleteAccount, updateAccount } from "@/lib/server/accountService";
import { badRequest, notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { getUserFromRequest } from "@/lib/server/sessionService";
import { accountUpdateSchema, parseValidation } from "@/lib/server/validation";

function getId(url: URL) {
  const id = Number(url.pathname.split("/").pop());
  return Number.isFinite(id) ? id : null;
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
      return badRequest("Invalid account id.");
    }

    const body = await request.json();
    const parsed = parseValidation(accountUpdateSchema, body);

    if (!parsed.success) {
      return badRequest("Validation failed.", parsed.error.flatten().fieldErrors);
    }

    const account = await updateAccount(accountId, parsed.data);
    if (!account) {
      return notFound("Account not found.");
    }

    return ok(account);
  } catch (error) {
    console.error("Failed to update account", error);
    return serverError("Unable to update account.");
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
      return badRequest("Invalid account id.");
    }

    const deleted = await deleteAccount(accountId);
    if (!deleted) {
      return notFound("Account not found.");
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete account", error);
    return serverError("Unable to delete account.");
  }
}

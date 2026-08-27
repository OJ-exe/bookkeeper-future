import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getAccounts,
  getAccountById,
  createAccount,
  deleteAccount,
} from "@/lib/server/accountService";

type CreateAccountInput = Parameters<typeof createAccount>[1];

describe("accountService - chart of accounts multi-tenancy", () => {
  const USER_1 = 1;
  const USER_2 = 2;

  it("retrieves accounts scoped to user", async () => {
    prismaMock.account.findMany.mockResolvedValue([]);
    await getAccounts(USER_1);

    expect(prismaMock.account.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_1 }),
      })
    );
  });

  it("creates account connected to authenticated user", async () => {
    const testInput = {
      name: "Operating Expenses",
      code: "6000",
      type: "EXPENSE",
      currency: "USD",
    } as unknown as CreateAccountInput;

    const mockAccount = { id: 10, userId: USER_1, ...testInput };
    prismaMock.account.create.mockResolvedValue(mockAccount as unknown);

    const created = await createAccount(USER_1, testInput);
    expect(prismaMock.account.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_1 } },
        }),
      })
    );
    expect(created.id).toBe(10);
  });

  it("prevents reading account belonging to another user", async () => {
    prismaMock.account.findFirst.mockResolvedValue(null);

    const result = await getAccountById(USER_2, 10);
    expect(prismaMock.account.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 10, userId: USER_2 }),
      })
    );
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned account", async () => {
    prismaMock.account.findFirst.mockResolvedValue(null);

    const result = await deleteAccount(USER_2, 10);
    expect(result).toBeNull();
    expect(prismaMock.account.delete).not.toHaveBeenCalled();
  });
});
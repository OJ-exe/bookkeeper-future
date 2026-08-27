import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getBankAccounts,
  getBankAccountById,
  createBankAccount,
  deleteBankAccount,
  createBankTransaction,
} from "@/lib/server/bankingService";

type CreateBankAccountInput = Parameters<typeof createBankAccount>[1];
type CreateBankTransactionInput = Parameters<typeof createBankTransaction>[1];

describe("bankingService - isolation & transaction boundary checks", () => {
  const USER_ID = 1;
  const OTHER_USER = 2;

  it("filters bank accounts by userId", async () => {
    prismaMock.bankAccount.findMany.mockResolvedValue([]);
    await getBankAccounts(USER_ID);
    expect(prismaMock.bankAccount.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      })
    );
  });

  it("creates a bank account connected to current user", async () => {
    const testInput = {
      name: "Checking Account",
      accountNumber: "123456789",
      bankName: "Chase",
      currency: "USD",
      balance: 10000,
    } as unknown as CreateBankAccountInput;

    const mockAccount = { id: 1, userId: USER_ID, ...testInput };
    prismaMock.bankAccount.create.mockResolvedValue(mockAccount as unknown);

    const result = await createBankAccount(USER_ID, testInput);
    expect(prismaMock.bankAccount.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_ID } },
        }),
      })
    );
    expect(result.id).toBe(1);
  });

  it("prevents attaching bank transaction to another user's bankAccount", async () => {
    prismaMock.bankAccount.findFirst.mockResolvedValue(null);

    const transactionInput = {
      amount: 1000,
      bankAccountId: 999,
      date: new Date("2026-08-01"),
      description: "Deposit",
      type: "INCOME",
    } as unknown as CreateBankTransactionInput;

    await expect(createBankTransaction(USER_ID, transactionInput)).rejects.toThrow(
      "Bank account not found or unauthorized"
    );
  });

  it("returns null when fetching bank account belonging to another tenant", async () => {
    prismaMock.bankAccount.findFirst.mockResolvedValue(null);

    const result = await getBankAccountById(OTHER_USER, 1);
    expect(prismaMock.bankAccount.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 1, userId: OTHER_USER }),
      })
    );
    expect(result).toBeNull();
  });

  it("returns null when deleting bank account belonging to another tenant", async () => {
    prismaMock.bankAccount.findFirst.mockResolvedValue(null);

    const result = await deleteBankAccount(OTHER_USER, 1);
    expect(result).toBeNull();
    expect(prismaMock.bankAccount.delete).not.toHaveBeenCalled();
  });
});
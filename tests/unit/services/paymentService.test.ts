import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getPayments,
  getPaymentById,
  createPayment,
  deletePayment,
} from "@/lib/server/paymentService";

type CreatePaymentInput = Parameters<typeof createPayment>[1];

describe("paymentService - cross-tenant relation validations", () => {
  const USER_ID = 1;
  const OTHER_USER = 2;

  it("scopes payment listing to current user", async () => {
    prismaMock.payment.findMany.mockResolvedValue([]);
    await getPayments(USER_ID);
    expect(prismaMock.payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      })
    );
  });

  it("verifies bankAccount belongs to user during payment creation", async () => {
    prismaMock.bankAccount.findFirst.mockResolvedValue(null);

    const testInput = {
      amount: 150,
      paymentDate: new Date("2026-08-01"),
      paymentMethod: "BANK_TRANSFER",
      bankAccountId: 44,
    } as unknown as CreatePaymentInput;

    await expect(createPayment(USER_ID, testInput)).rejects.toThrow(
      "Invalid bank account"
    );
  });

  it("creates payment successfully when relation IDs belong to user", async () => {
    prismaMock.customer.findFirst.mockResolvedValue({ id: 10, userId: USER_ID } as unknown);
    prismaMock.invoice.findFirst.mockResolvedValue({ id: 20, userId: USER_ID } as unknown);
    prismaMock.bankAccount.findFirst.mockResolvedValue({ id: 30, userId: USER_ID } as unknown);
    prismaMock.payment.create.mockResolvedValue({ id: 1, userId: USER_ID, amount: 200 } as unknown);

    const testInput = {
      amount: 200,
      paymentDate: new Date("2026-08-01"),
      paymentMethod: "BANK_TRANSFER",
      customerId: 10,
      invoiceId: 20,
      bankAccountId: 30,
    } as unknown as CreatePaymentInput;

    await createPayment(USER_ID, testInput);

    expect(prismaMock.payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          amount: 200,
          user: { connect: { id: USER_ID } },
          customer: { connect: { id: 10 } },
          invoice: { connect: { id: 20 } },
          bankAccount: { connect: { id: 30 } },
        }),
      })
    );
  });

  it("returns null when accessing payment belonging to another tenant", async () => {
    prismaMock.payment.findFirst.mockResolvedValue(null);

    const result = await getPaymentById(OTHER_USER, 1);
    expect(prismaMock.payment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 1, userId: OTHER_USER }),
      })
    );
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned payment", async () => {
    prismaMock.payment.findFirst.mockResolvedValue(null);

    const result = await deletePayment(OTHER_USER, 1);
    expect(result).toBeNull();
    expect(prismaMock.payment.delete).not.toHaveBeenCalled();
  });
});
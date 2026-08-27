import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getBills,
  getBillById,
  createBill,
  deleteBill,
} from "@/lib/server/billService";

type CreateBillInput = Parameters<typeof createBill>[1];

describe("billService - isolation & vendor boundary checks", () => {
  const USER_ID = 1;
  const OTHER_USER = 2;

  it("scopes bill retrieval by userId", async () => {
    prismaMock.bill.findMany.mockResolvedValue([]);
    await getBills(USER_ID);
    expect(prismaMock.bill.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      })
    );
  });

  it("throws error when vendorId does not belong to user", async () => {
    prismaMock.vendor.findFirst.mockResolvedValue(null);

    const testInput = {
      number: "BILL-100",
      vendorId: 999,
      issueDate: new Date("2026-08-01"),
      dueDate: new Date("2026-08-30"),
      currency: "USD",
      subtotal: 300,
      tax: 0,
      total: 300,
      notes: "",
    } as unknown as CreateBillInput;

    await expect(createBill(USER_ID, testInput)).rejects.toThrow(
      "Referenced vendor not found or unauthorized"
    );
  });

  it("creates bill when vendorId is valid and owned", async () => {
    const mockVendor = { id: 25, userId: USER_ID, name: "Acme Supplies" };
    const mockCreatedBill = { id: 10, userId: USER_ID, number: "BILL-100" };

    prismaMock.vendor.findFirst.mockResolvedValue(mockVendor as unknown);
    prismaMock.bill.create.mockResolvedValue(mockCreatedBill as unknown);

    const testInput = {
      number: "BILL-100",
      vendorId: 25,
      issueDate: new Date("2026-08-01"),
      dueDate: new Date("2026-08-30"),
      currency: "USD",
      subtotal: 300,
      tax: 0,
      total: 300,
      notes: "",
    } as unknown as CreateBillInput;

    await createBill(USER_ID, testInput);

    expect(prismaMock.bill.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_ID } },
          vendorRecord: { connect: { id: 25 } },
        }),
      })
    );
  });

  it("prevents fetching bill owned by another user", async () => {
    prismaMock.bill.findFirst.mockResolvedValue(null);

    const result = await getBillById(OTHER_USER, 10);
    expect(prismaMock.bill.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 10, userId: OTHER_USER }),
      })
    );
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned bill", async () => {
    prismaMock.bill.findFirst.mockResolvedValue(null);

    const result = await deleteBill(OTHER_USER, 10);
    expect(result).toBeNull();
    expect(prismaMock.bill.delete).not.toHaveBeenCalled();
  });
});
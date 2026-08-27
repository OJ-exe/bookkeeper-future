import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  deleteInvoice,
} from "@/lib/server/invoiceService";

type CreateInvoiceInput = Parameters<typeof createInvoice>[1];

describe("invoiceService - multi-tenant checks", () => {
  const USER_1 = 1;
  const USER_2 = 2;

  it("scopes getInvoices to userId", async () => {
    prismaMock.invoice.findMany.mockResolvedValue([]);
    await getInvoices(USER_1);
    expect(prismaMock.invoice.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_1 }),
      })
    );
  });

  it("rejects invoice creation with customer belonging to another user", async () => {
    prismaMock.customer.findFirst.mockResolvedValue(null);

    const testInput = {
      number: "INV-001",
      customerId: 999,
      issueDate: new Date("2026-08-01"),
      dueDate: new Date("2026-08-30"),
      subtotal: 500,
      tax: 0,
      total: 500,
      notes: "",
    } as unknown as CreateInvoiceInput;

    await expect(createInvoice(USER_1, testInput)).rejects.toThrow(
      "Referenced customer not found or unauthorized"
    );
  });

  it("creates invoice when customer ownership is verified", async () => {
    const mockCustomer = { id: 50, userId: USER_1, name: "Valid Customer" };
    const mockCreatedInvoice = { id: 1, userId: USER_1, number: "INV-001", total: 500 };

    prismaMock.customer.findFirst.mockResolvedValue(mockCustomer as unknown);
    prismaMock.invoice.create.mockResolvedValue(mockCreatedInvoice as unknown);

    const testInput = {
      number: "INV-001",
      customerId: 50,
      issueDate: new Date("2026-08-01"),
      dueDate: new Date("2026-08-30"),
      subtotal: 500,
      tax: 0,
      total: 500,
      notes: "",
    } as unknown as CreateInvoiceInput;

    const result = await createInvoice(USER_1, testInput);

    expect(prismaMock.invoice.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_1 } },
          customerRecord: { connect: { id: 50 } },
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("prevents reading invoice belonging to another user", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(null);

    const result = await getInvoiceById(USER_2, 1);
    expect(prismaMock.invoice.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 1, userId: USER_2 }),
      })
    );
    expect(result).toBeNull();
  });

  it("returns null when deleting an unowned invoice", async () => {
    prismaMock.invoice.findFirst.mockResolvedValue(null);

    const result = await deleteInvoice(USER_2, 1);
    expect(result).toBeNull();
    expect(prismaMock.invoice.delete).not.toHaveBeenCalled();
  });
});
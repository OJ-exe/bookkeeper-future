import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  deleteCustomer,
} from "@/lib/server/customerService";

describe("customerService - multi-tenant isolation", () => {
  const USER_A = 1;
  const USER_B = 2;

  it("filters customer list by userId", async () => {
    const mockCustomer = {
      id: 10,
      userId: USER_A,
      name: "Customer A",
      email: "cust.a@example.com",
      phone: "1234567890",
      address: "123 Street",
      currency: "USD",
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.customer.findMany.mockResolvedValue([mockCustomer] as unknown[]);

    const result = await getCustomers(USER_A);
    expect(prismaMock.customer.findMany).toHaveBeenCalledWith({
      where: { userId: USER_A },
      orderBy: { createdAt: "desc" },
    });
    expect(result).toHaveLength(1);
  });

  it("prevents reading customer belonging to another user", async () => {
    prismaMock.customer.findFirst.mockResolvedValue(null);

    const result = await getCustomerById(USER_B, 10);
    expect(prismaMock.customer.findFirst).toHaveBeenCalledWith({
      where: { id: 10, userId: USER_B },
    });
    expect(result).toBeNull();
  });

  it("connects authenticated userId on create", async () => {
    const newCustomerInput = {
      name: "New Cust",
      email: "new@example.com",
      phone: "9876543210",
      address: "456 Avenue",
      currency: "USD",
    };

    const createdCustomer = {
      id: 11,
      userId: USER_A,
      ...newCustomerInput,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.customer.create.mockResolvedValue(createdCustomer as unknown);

    await createCustomer(USER_A, newCustomerInput);
    expect(prismaMock.customer.create).toHaveBeenCalledWith({
      data: {
        ...newCustomerInput,
        user: { connect: { id: USER_A } },
      },
    });
  });

  it("returns null when deleting unowned customer", async () => {
    prismaMock.customer.findFirst.mockResolvedValue(null);

    const result = await deleteCustomer(USER_B, 10);
    expect(result).toBeNull();
    expect(prismaMock.customer.delete).not.toHaveBeenCalled();
  });
});
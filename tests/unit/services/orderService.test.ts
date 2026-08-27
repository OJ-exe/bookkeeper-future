import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getOrders,
  getOrderById,
  createOrder,
  deleteOrder,
} from "@/lib/server/orderService";

type CreateOrderInput = Parameters<typeof createOrder>[1];

describe("orderService - multi-tenant checks", () => {
  const USER_ID = 1;
  const OTHER_USER = 2;

  it("scopes order queries to userId", async () => {
    prismaMock.order.findMany.mockResolvedValue([]);
    await getOrders(USER_ID);

    expect(prismaMock.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      })
    );
  });

  it("creates order record linked to user", async () => {
    const testInput = {
      orderNumber: "ORD-99",
      totalAmount: 1200,
      status: "PENDING",
    } as unknown as CreateOrderInput;

    const mockOrder = { id: 33, userId: USER_ID, ...testInput };
    prismaMock.order.create.mockResolvedValue(mockOrder as unknown);

    const result = await createOrder(USER_ID, testInput);
    expect(prismaMock.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_ID } },
        }),
      })
    );
    expect(result.id).toBe(33);
  });

  it("returns null when reading unowned order", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const result = await getOrderById(OTHER_USER, 33);
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned order", async () => {
    prismaMock.order.findFirst.mockResolvedValue(null);

    const result = await deleteOrder(OTHER_USER, 33);
    expect(result).toBeNull();
    expect(prismaMock.order.delete).not.toHaveBeenCalled();
  });
});
import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getVendors,
  getVendorById,
  createVendor,
  deleteVendor,
} from "@/lib/server/vendorService";

type CreateVendorInput = Parameters<typeof createVendor>[1];

describe("vendorService - multi-tenant isolation", () => {
  const USER_A = 1;
  const USER_B = 2;

  it("scopes vendor list by userId", async () => {
    prismaMock.vendor.findMany.mockResolvedValue([]);
    await getVendors(USER_A);

    expect(prismaMock.vendor.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_A }),
      })
    );
  });

  it("creates vendor attached to userId", async () => {
    const testInput = {
      name: "Vendor Supplies Co",
      email: "supply@vendor.com",
      phone: "111222333",
    } as unknown as CreateVendorInput;

    const mockVendor = { id: 100, userId: USER_A, ...testInput };
    prismaMock.vendor.create.mockResolvedValue(mockVendor as unknown);

    const result = await createVendor(USER_A, testInput);
    expect(prismaMock.vendor.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_A } },
        }),
      })
    );
    expect(result.id).toBe(100);
  });

  it("returns null when accessing vendor of another user", async () => {
    prismaMock.vendor.findFirst.mockResolvedValue(null);

    const result = await getVendorById(USER_B, 100);
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned vendor", async () => {
    prismaMock.vendor.findFirst.mockResolvedValue(null);

    const result = await deleteVendor(USER_B, 100);
    expect(result).toBeNull();
    expect(prismaMock.vendor.delete).not.toHaveBeenCalled();
  });
});
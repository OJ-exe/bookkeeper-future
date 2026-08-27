import { describe, it, expect,  } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  hashPassword,
  verifyPassword,
  createUser,
  authenticateUser,
} from "@/lib/server/authService";

describe("authService", () => {
  it("hashes password and verifies it successfully", async () => {
    const rawPassword = "securePassword123";
    const hashed = await hashPassword(rawPassword);

    expect(hashed).not.toBe(rawPassword);
    const isValid = await verifyPassword(rawPassword, hashed);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword("wrongPassword", hashed);
    expect(isInvalid).toBe(false);
  });

  it("creates user with hashed password", async () => {
    const input = {
      name: "Alice Doe",
      email: "alice@example.com",
      password: "password123",
    };

    const mockUser = {
      id: 1,
      name: input.name,
      email: input.email,
      passwordHash: "hashed_dummy_val",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prismaMock.user.create.mockResolvedValue(mockUser as unknown);

    const result = await createUser(input);

    expect(prismaMock.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          name: input.name,
          email: input.email,
        }),
      })
    );
    expect(result.id).toBe(1);
  });

  it("authenticates valid user credentials", async () => {
    const rawPassword = "password123";
    const passwordHash = await hashPassword(rawPassword);

    const mockUser = {
      id: 1,
      email: "alice@example.com",
      passwordHash,
      name: "Alice Doe",
    };

    prismaMock.user.findUnique.mockResolvedValue(mockUser as unknown);

    const user = await authenticateUser("alice@example.com", rawPassword);
    expect(user).not.toBeNull();
    expect(user?.id).toBe(1);
  });

  it("returns null for non-existent user or invalid password", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    const nonExistent = await authenticateUser("notfound@example.com", "pass");
    expect(nonExistent).toBeNull();
  });
});
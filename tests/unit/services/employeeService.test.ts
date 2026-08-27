import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  deleteEmployee,
} from "@/lib/server/employeeService";

type CreateEmployeeInput = Parameters<typeof createEmployee>[1];

describe("employeeService - multi-tenant checks", () => {
  const USER_ID = 1;
  const OTHER_USER = 2;

  it("scopes employee queries to userId", async () => {
    prismaMock.employee.findMany.mockResolvedValue([]);
    await getEmployees(USER_ID);

    expect(prismaMock.employee.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      })
    );
  });

  it("creates employee record linked to user", async () => {
    const testInput = {
      name: "John Smith",
      email: "john@corp.com",
      role: "Engineer",
      salary: 85000,
    } as unknown as CreateEmployeeInput;

    const mockEmployee = { id: 5, userId: USER_ID, ...testInput };
    prismaMock.employee.create.mockResolvedValue(mockEmployee as unknown);

    const result = await createEmployee(USER_ID, testInput);
    expect(prismaMock.employee.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_ID } },
        }),
      })
    );
    expect(result.id).toBe(5);
  });

  it("prevents fetching employee of another user", async () => {
    prismaMock.employee.findFirst.mockResolvedValue(null);

    const result = await getEmployeeById(OTHER_USER, 5);
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned employee", async () => {
    prismaMock.employee.findFirst.mockResolvedValue(null);

    const result = await deleteEmployee(OTHER_USER, 5);
    expect(result).toBeNull();
    expect(prismaMock.employee.delete).not.toHaveBeenCalled();
  });
});
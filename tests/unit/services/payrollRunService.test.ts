import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  getPayrollRuns,
  getPayrollRunById,
  createPayrollRun,
  deletePayrollRun,
} from "@/lib/server/payrollService";

type CreatePayrollRunInput = Parameters<typeof createPayrollRun>[1];
type PayrollId = Parameters<typeof getPayrollRunById>[1];

describe("payrollRunService - multi-tenant checks", () => {
  const USER_ID = 1;
  const OTHER_USER = 2;
  const TARGET_ID = (12 as unknown) as PayrollId;

  it("scopes payroll run queries to userId", async () => {
    prismaMock.payrollRun.findMany.mockResolvedValue([]);
    await getPayrollRuns(USER_ID);

    expect(prismaMock.payrollRun.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: USER_ID }),
      })
    );
  });

  it("creates payroll run connected to user", async () => {
    const testInput = {
      payrollDate: new Date("2026-08-31"),
      totalAmount: 45000,
      status: "COMPLETED",
    } as unknown as CreatePayrollRunInput;

    const mockPayrollResponse = {
      id: TARGET_ID,
      userId: USER_ID,
      payrollDate: new Date("2026-08-31"),
      totalAmount: 45000,
      status: "COMPLETED",
    } as unknown as Awaited<ReturnType<typeof createPayrollRun>>;

    prismaMock.payrollRun.create.mockResolvedValue(mockPayrollResponse);

    const result = await createPayrollRun(USER_ID, testInput);
    expect(prismaMock.payrollRun.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          user: { connect: { id: USER_ID } },
        }),
      })
    );
    expect(result).toBeDefined();
  });

  it("returns null when accessing payroll run belonging to another user", async () => {
    prismaMock.payrollRun.findFirst.mockResolvedValue(null);

    const result = await getPayrollRunById(OTHER_USER, TARGET_ID);
    expect(result).toBeNull();
  });

  it("returns null when deleting unowned payroll run", async () => {
    prismaMock.payrollRun.findFirst.mockResolvedValue(null);

    const result = await deletePayrollRun(OTHER_USER, TARGET_ID);
    expect(result).toBeNull();
    expect(prismaMock.payrollRun.delete).not.toHaveBeenCalled();
  });
});
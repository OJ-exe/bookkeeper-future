import { vi, type Mock } from "vitest";

export type MockModel = {
  findMany: Mock;
  findFirst: Mock;
  findUnique: Mock;
  create: Mock;
  update: Mock;
  delete: Mock;
  deleteMany: Mock;
  count: Mock;
};

const createMockModel = (): MockModel => ({
  findMany: vi.fn(),
  findFirst: vi.fn(),
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  deleteMany: vi.fn(),
  count: vi.fn(),
});

export interface PrismaMockType {
  user: MockModel;
  session: MockModel;
  customer: MockModel;
  vendor: MockModel;
  employee: MockModel;
  account: MockModel;
  order: MockModel;
  payrollRun: MockModel;
  invoice: MockModel;
  bill: MockModel;
  bankAccount: MockModel;
  bankTransaction: MockModel;
  payment: MockModel;
  $transaction: Mock;
}

export const prismaMock: PrismaMockType = {
  user: createMockModel(),
  session: createMockModel(),
  customer: createMockModel(),
  vendor: createMockModel(),
  employee: createMockModel(),
  account: createMockModel(),
  order: createMockModel(),
  payrollRun: createMockModel(),
  invoice: createMockModel(),
  bill: createMockModel(),
  bankAccount: createMockModel(),
  bankTransaction: createMockModel(),
  payment: createMockModel(),
  $transaction: vi.fn((callback: (tx: PrismaMockType) => unknown) => callback(prismaMock)),
};

export const resetPrismaMock = (): void => {
  const models = Object.values(prismaMock) as (MockModel | Mock)[];
  for (const model of models) {
    if (typeof model === "object" && model !== null) {
      for (const fn of Object.values(model)) {
        if (typeof fn?.mockReset === "function") {
          fn.mockReset();
        }
      }
    } else if (typeof (model as Mock)?.mockReset === "function") {
      (model as Mock).mockReset();
    }
  }
};
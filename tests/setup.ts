import { vi, beforeEach } from "vitest";
import { prismaMock, resetPrismaMock } from "./mocks/prismaMockModule";

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

beforeEach(() => {
  resetPrismaMock();
});
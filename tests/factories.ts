export const createTestUser = (overrides = {}) => ({
  id: 1,
  email: "user@test.com",
  name: "Test User",
  passwordHash: "$2b$10$abcdefghijklmnopqrstuv",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestCustomer = (userId = 1, overrides = {}) => ({
  id: 100,
  userId,
  name: "Acme Corp",
  email: "acme@example.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTestVendor = (userId = 1, overrides = {}) => ({
  id: 200,
  userId,
  name: "Global Supplies",
  email: "contact@globalsupplies.com",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
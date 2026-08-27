import { describe, it, expect } from "vitest";
import { prismaMock } from "../../mocks/prismaMockModule";
import {
  createSession,
  getSessionByToken,
  deleteSession,
} from "@/lib/server/sessionService";

describe("sessionService", () => {
  const USER_ID = 1;
  const MOCK_TOKEN = "mock-token-xyz";

  it("creates and stores a session", async () => {
    const mockSession = {
      id: "sess-1",
      token: MOCK_TOKEN,
      userId: USER_ID,
      expiresAt: new Date(Date.now() + 86400000),
    } as unknown as Awaited<ReturnType<typeof createSession>>;

    prismaMock.session.create.mockResolvedValue(mockSession);

    // Handles both createSession(userId) and createSession(userId, token)
    const session = await (createSession as (...args: unknown[]) => Promise<typeof mockSession>)(
      USER_ID,
      MOCK_TOKEN
    );

    expect(prismaMock.session.create).toHaveBeenCalled();
    expect(session).toBeDefined();
  });

  it("retrieves a valid session including user", async () => {
    const mockSession = {
      id: "sess-1",
      token: MOCK_TOKEN,
      userId: USER_ID,
      expiresAt: new Date(Date.now() + 86400000),
      user: { id: USER_ID, email: "user@test.com" },
    } as unknown as Awaited<ReturnType<typeof getSessionByToken>>;

    prismaMock.session.findUnique.mockResolvedValue(mockSession);

    const session = await getSessionByToken(MOCK_TOKEN);
    expect(session).not.toBeNull();
  });

  it("deletes a session by token", async () => {
    prismaMock.session.deleteMany.mockResolvedValue({ count: 1 } as unknown);

    await deleteSession(MOCK_TOKEN);
    expect(prismaMock.session.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ token: MOCK_TOKEN }),
      })
    );
  });
});
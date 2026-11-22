import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/divesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "new-dive-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

jest.unstable_mockModule("../repositories/buddiesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(async () => []),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "new-buddy-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

const { createDive, deleteDive, updateDive } = await import("../services/divesService.js");
const { createBuddy, deleteBuddy } = await import("../services/buddiesService.js");
const divesRepository = await import("../repositories/divesRepository.js");
const buddiesRepository = await import("../repositories/buddiesRepository.js");

const alice = { id: "alice-id", role: "member" };
const bob = { id: "bob-id", role: "member" };
const admin = { id: "admin-id", role: "admin" };

const alicesDive = {
  _id: "dive-1",
  ownerId: { toString: () => "alice-id" },
  date: "2026-08-14",
  diveTime: 45,
  maxDepth: 18,
};
const alicesBuddy = {
  _id: "buddy-1",
  ownerId: { toString: () => "alice-id" },
  name: "Juan",
};

const validDive = { date: "2026-08-14", diveTime: 45, maxDepth: 18, decompressionTime: null };

beforeEach(() => jest.clearAllMocks());

describe("deleteDive", () => {
  test("a member who does not own the dive gets a 403 and nothing is deleted", async () => {
    divesRepository.findById.mockResolvedValueOnce(alicesDive);

    const result = await deleteDive("dive-1", bob);

    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(403);
    expect(divesRepository.removeById).not.toHaveBeenCalled();
  });

  test("the owner can delete their own dive", async () => {
    divesRepository.findById.mockResolvedValueOnce(alicesDive);

    const result = await deleteDive("dive-1", alice);

    expect(result.ok).toBe(true);
    expect(divesRepository.removeById).toHaveBeenCalledWith("dive-1");
  });

  test("an admin can delete a dive they do not own", async () => {
    divesRepository.findById.mockResolvedValueOnce(alicesDive);

    const result = await deleteDive("dive-1", admin);

    expect(result.ok).toBe(true);
    expect(divesRepository.removeById).toHaveBeenCalledWith("dive-1");
  });

  test("a dive that does not exist is a 404, not a 403", async () => {
    divesRepository.findById.mockResolvedValueOnce(null);

    const result = await deleteDive("missing", bob);

    expect(result.error.status).toBe(404);
    expect(divesRepository.removeById).not.toHaveBeenCalled();
  });
});

describe("updateDive", () => {
  test("a member who does not own the dive gets a 403 and nothing is updated", async () => {
    divesRepository.findById.mockResolvedValueOnce(alicesDive);

    const result = await updateDive("dive-1", validDive, bob);

    expect(result.error.status).toBe(403);
    expect(divesRepository.updateById).not.toHaveBeenCalled();
  });
});

describe("createDive", () => {
  test("the owner comes from the logged-in user, not from the request body", async () => {
    const result = await createDive({ ...validDive, ownerId: "bob-id" }, alice);

    expect(divesRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: "alice-id" }),
    );
    expect(result.ok).toBe(true);
    expect(result.value.ownerId).toBeUndefined();
  });
});

describe("deleteBuddy", () => {
  test("a member who does not own the buddy gets a 403 and nothing is deleted", async () => {
    buddiesRepository.findById.mockResolvedValueOnce(alicesBuddy);

    const result = await deleteBuddy("buddy-1", bob);

    expect(result.ok).toBe(false);
    expect(result.error.status).toBe(403);
    expect(buddiesRepository.removeById).not.toHaveBeenCalled();
  });

  test("the owner can delete their own buddy", async () => {
    buddiesRepository.findById.mockResolvedValueOnce(alicesBuddy);

    const result = await deleteBuddy("buddy-1", alice);

    expect(result.ok).toBe(true);
    expect(buddiesRepository.removeById).toHaveBeenCalledWith("buddy-1");
  });

  test("an admin can delete a buddy they do not own", async () => {
    buddiesRepository.findById.mockResolvedValueOnce(alicesBuddy);

    const result = await deleteBuddy("buddy-1", admin);

    expect(result.ok).toBe(true);
    expect(buddiesRepository.removeById).toHaveBeenCalledWith("buddy-1");
  });
});

describe("createBuddy", () => {
  test("the owner comes from the logged-in user, not from the request body", async () => {
    const result = await createBuddy({ name: "Sam", ownerId: "bob-id" }, alice);

    expect(buddiesRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ ownerId: "alice-id" }),
    );
    expect(result.ok).toBe(true);
    expect(result.value.ownerId).toBeUndefined();
  });
});
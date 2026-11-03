import { expect } from "@jest/globals";
import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/buddiesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

const { listBuddies, createBuddy } =
  await import("../services/buddiesService.js");

const { toBuddyDto } = await import("../dtos/buddyDto.js");

const { getAll, create } =
  await import("../repositories/buddiesRepository.js");

test("listBuddies returns buddy DTO for all existing buddies in the repository", async () => {
  const buddyList = [
    {
      _id: "1",
      name: "Alice",
      certification: "Open Water",
      email: "alice@example.com",
    },
    {
      _id: "2",
      name: "Bob",
      certification: "Advanced",
      email: "bob@example.com",
    },
  ];
  getAll.mockResolvedValueOnce(buddyList);

  const buddies = await listBuddies();

  expect(buddies.length).toBe(2);
  for (let i = 0; i < 2; i++) {
    expect(buddies[i]).toStrictEqual(toBuddyDto(buddyList[i]));
  }
});

test("listBuddies returns empty list if repository is empty (contains no buddies)", async () => {
  getAll.mockResolvedValueOnce([]);

  const buddies = await listBuddies();

  expect(buddies.length).toBe(0);
});

test("createBuddy rejects on missing body", async () => {
  const result = await createBuddy(undefined);

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty("status", 400);
  expect(result.error).toHaveProperty("message", "name is required");
});

test("createBuddy rejects on missing or empty or non-string or excesive-length buddy name", async () => {
  const missingResult = await createBuddy({});
  expect(missingResult).toHaveProperty("ok", false);
  expect(missingResult.error).toHaveProperty("status", 400);
  expect(missingResult.error).toHaveProperty("message", "name is required");

  const emptyResult = await createBuddy({ name: "" });
  expect(emptyResult).toHaveProperty("ok", false);
  expect(emptyResult.error).toHaveProperty("status", 400);
  expect(emptyResult.error).toHaveProperty("message", "name is required");

  const whitespaceResult = await createBuddy({ name: "   " });
  expect(whitespaceResult).toHaveProperty("ok", false);
  expect(whitespaceResult.error).toHaveProperty("status", 400);
  expect(whitespaceResult.error).toHaveProperty("message", "name is required");

  const nonStringResult = await createBuddy({ name: 123 });
  expect(nonStringResult).toHaveProperty("ok", false);
  expect(nonStringResult.error).toHaveProperty("status", 400);
  expect(nonStringResult.error).toHaveProperty("message", "name is required");

  const excessiveLengthResult = await createBuddy({
    name: "a".repeat(101),
  });
  expect(excessiveLengthResult).toHaveProperty("ok", false);
  expect(excessiveLengthResult.error).toHaveProperty("status", 400);
  expect(excessiveLengthResult.error).toHaveProperty(
    "message",
    "name must be 100 characters or fewer",
  );
});

test("createBuddy rejects on non-string certification", async () => {
  const result = await createBuddy({
    name: "John Doe",
    certification: 123,
  });

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty("status", 400);
  expect(result.error).toHaveProperty(
    "message",
    "certification must be text",
  );
});

test("createBuddy rejects on non-string email or email non-compliant with email pattern", async () => {
  const nonStringResult = await createBuddy({
    name: "John Doe",
    email: 123,
  });
  expect(nonStringResult).toHaveProperty("ok", false);
  expect(nonStringResult.error).toHaveProperty("status", 400);
  expect(nonStringResult.error).toHaveProperty(
    "message",
    "email must be text",
  );

  const nonCompliantResult = await createBuddy({
    name: "John Doe",
    email: "invalid-email",
  });
  expect(nonCompliantResult).toHaveProperty("ok", false);
  expect(nonCompliantResult.error).toHaveProperty("status", 400);
  expect(nonCompliantResult.error).toHaveProperty(
    "message",
    "email must be a valid email address",
  );
});

test("createBuddy rejects on an already existing buddy with a 409-shaped error", async () => {
  getAll.mockResolvedValueOnce([
    {
      _id: "1",
      name: "John Doe",
      certification: "Open Water",
      email: "john@example.com",
    },
  ]);

  const result = await createBuddy({
    name: "John Doe",
    certification: "Advanced",
    email: "johndoe@example.com",
  });

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty("status", 409);
  expect(result.error).toHaveProperty(
    "message",
    'a dive buddy named "John Doe" already exists',
  );
});

test("createBuddy returns a buddy DTO if all buddy data fields are successful", async () => {
  const buddyData = {
    name: "Jane Doe",
    certification: "Rescue Diver",
    email: "jane@example.com",
  };
  getAll.mockResolvedValueOnce([]);
  create.mockResolvedValueOnce({
    _id: "fake-id",
    ...buddyData,
  });

  const result = await createBuddy(buddyData);

  expect(result).toHaveProperty("ok", true);
  expect(result.value).toStrictEqual(
    toBuddyDto({
      _id: "fake-id",
      ...buddyData,
    }),
  );
});

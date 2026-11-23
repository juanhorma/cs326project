import { expect } from "@jest/globals";
import { jest } from "@jest/globals";
const admin = { id: "admin-id", role: "admin" };

jest.unstable_mockModule("../repositories/divesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));

const { listDives, createDive, getDiveById } =
  await import("../services/divesService.js");

const { toDiveDto } = await import("../dtos/diveDto.js");

const { findById, getAll } = await import("../repositories/divesRepository.js");

test("listDives only returns dives with matching location, case agnostic", async () => {
  {
    getAll.mockReturnValueOnce([
      { _id: 1234, date: "04/23/2026", diveTime: 45, maxDepth: 34 },
      {
        _id: 213,
        date: "03/05/2025",
        diveTime: 34,
        maxDepth: 64,
        location: "Azores",
      },
      {
        _id: 214,
        date: "03/05/2025",
        diveTime: 34,
        maxDepth: 30,
        location: "Azores, second stint",
      },
      {
        _id: 215,
        date: "03/05/2025",
        diveTime: 30,
        maxDepth: 60,
        location: "azores, third stint",
      },
    ]);
    const dives = await listDives("Azores", admin);
    expect(dives.length).toBe(3);
    expect(dives[0].location).toBe("Azores");
    expect(dives[0].id).toBe("213");
    expect(dives[1].location).toBe("Azores, second stint");
    expect(dives[1].id).toBe("214");
    expect(dives[2].location).toBe("azores, third stint");
    expect(dives[2].id).toBe("215");
  }
});

test("listDives returns empty list if no dives match location", async () => {
  getAll.mockReturnValueOnce([
    { _id: 1234, date: "04/23/2026", diveTime: 45, maxDepth: 34 },
    {
      _id: 213,
      date: "03/05/2025",
      diveTime: 34,
      maxDepth: 64,
      location: "Azores",
    },
    {
      _id: 214,
      date: "03/05/2025",
      diveTime: 34,
      maxDepth: 30,
      location: "Azores, second stint",
    },
    {
      _id: 215,
      date: "03/05/2025",
      diveTime: 30,
      maxDepth: 60,
      location: "azores, third stint",
    },
  ]);
  const dives = await listDives("Java", admin);
  expect(dives.length).toBe(0);
});

test("listDives returns full list if no location is provided", async () => {
  const diveList = [
    { _id: 1234, date: "04/23/2026", diveTime: 45, maxDepth: 34 },
    {
      _id: 213,
      date: "03/05/2025",
      diveTime: 34,
      maxDepth: 64,
      location: "Azores",
    },
    {
      _id: 214,
      date: "03/05/2025",
      diveTime: 34,
      maxDepth: 30,
      location: "Azores, second stint",
    },
    {
      _id: 215,
      date: "03/05/2025",
      diveTime: 30,
      maxDepth: 60,
      location: "azores, third stint",
    },
  ];
  getAll.mockReturnValueOnce(diveList);

  const dives = await listDives(undefined, admin);
  expect(dives.length).toBe(4);
  for (let i = 0; i < 4; i++) {
    expect(dives[i]).toStrictEqual(toDiveDto(diveList[i]));
  }
});

test("createDive rejects a missing date", async () => {
  const result = await createDive({
    location: "Utah",
    diveTime: 34,
    maxDepth: 55,
    notes: "YEAH BUDDY",
  });

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty(
    "message",
    "date, dive time, and maximum depth are required",
  );
});

test("createDive rejects a missing dive time", async () => {
  const result = await createDive({ maxDepth: 55, notes: "LIGHTWEIGHT BABY" });

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty(
    "message",
    "date, dive time, and maximum depth are required",
  );
});

test("createDive rejects a missing maximum depth", async () => {
  const result = await createDive({
    location: "Alabama",
    notes: "found a water phallus on my way up",
  });

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty(
    "message",
    "date, dive time, and maximum depth are required",
  );
});

test("createDive rejects an infinite or negative diveTime", async () => {
  const negativeResult = await createDive({
    date: "04/23/2026",
    location: "Utah",
    diveTime: -10,
    maxDepth: 55,
  });

  expect(negativeResult).toHaveProperty("ok", false);
  expect(negativeResult.error).toHaveProperty(
    "message",
    "dive time and maximum depth must be greater than 0",
  );

  const infiniteResult = await createDive({
    date: "04/23/2026",
    location: "Utah",
    diveTime: Infinity,
    maxDepth: 55,
  });

  expect(infiniteResult).toHaveProperty("ok", false);
  expect(infiniteResult.error).toHaveProperty(
    "message",
    "dive time and maximum depth must be greater than 0",
  );
});

test("createDive rejects an infinite or negative maximum depth", async () => {
  const negativeResult = await createDive({
    date: "04/23/2026",
    location: "Utah",
    diveTime: 34,
    maxDepth: -10,
  });

  expect(negativeResult).toHaveProperty("ok", false);
  expect(negativeResult.error).toHaveProperty(
    "message",
    "dive time and maximum depth must be greater than 0",
  );

  const infiniteResult = await createDive({
    date: "04/23/2026",
    location: "Utah",
    diveTime: 34,
    maxDepth: Infinity,
  });

  expect(infiniteResult).toHaveProperty("ok", false);
  expect(infiniteResult.error).toHaveProperty(
    "message",
    "dive time and maximum depth must be greater than 0",
  );
});

test("createDive rejects an infinite or negative decompression time", async () => {
  const negativeResult = await createDive({
    date: "04/23/2026",
    location: "Utah",
    diveTime: 34,
    maxDepth: 55,
    decompressionTime: -5,
  });

  expect(negativeResult).toHaveProperty("ok", false);
  expect(negativeResult.error).toHaveProperty(
    "message",
    "Decompression Time must be greater than or equal to 0",
  );

  const infiniteResult = await createDive({
    date: "04/23/2026",
    location: "Utah",
    diveTime: 34,
    maxDepth: 55,
    decompressionTime: Infinity,
  });

  expect(infiniteResult).toHaveProperty("ok", false);
  expect(infiniteResult.error).toHaveProperty(
    "message",
    "Decompression Time must be greater than or equal to 0",
  );
});

test("createDive rejects a missing body", async () => {
  const emptyResult = await createDive(undefined);

  expect(emptyResult).toHaveProperty("ok", false);
  expect(emptyResult.error).toHaveProperty(
    "message",
    "date, dive time, and maximum depth are required",
  );
});

test("createDive rejects a future date", async () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString("en-CA");

  const tomorrowResult = await createDive({
    date: tomorrowStr,
    diveTime: 34,
    maxDepth: 55,
  });

  expect(tomorrowResult).toHaveProperty("ok", false);
  expect(tomorrowResult.error).toHaveProperty("status", 400);
  expect(tomorrowResult.error).toHaveProperty(
    "message",
    "date cannot be in the future",
  );

  const farFutureResult = await createDive({
    date: "2099-01-01",
    diveTime: 34,
    maxDepth: 55,
  });

  expect(farFutureResult).toHaveProperty("ok", false);
  expect(farFutureResult.error).toHaveProperty("status", 400);
  expect(farFutureResult.error).toHaveProperty(
    "message",
    "date cannot be in the future",
  );
});

test("createDive rejects an invalid date", async () => {
  const result = await createDive({
    date: "not-a-date",
    diveTime: 34,
    maxDepth: 55,
  });

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty("status", 400);
  expect(result.error).toHaveProperty("message", "date must be a valid date");
});

test("createDive accepts today's date", async () => {
  const todayStr = new Date().toLocaleDateString("en-CA");
  const result = await createDive({
    date: todayStr,
    diveTime: 34,
    decompressionTime: 0,
    maxDepth: 30,
  });

  expect(result).toHaveProperty("ok", true);
  expect(result.value).toStrictEqual(
    toDiveDto({
      _id: "fake-id",
      date: todayStr,
      diveTime: 34,
      decompressionTime: 0,
      maxDepth: 30,
    }),
  );
});

test("createDive returns DTO of compliant dive data", async () => {
  const compliantDive = {
    date: "2026/07/23",
    location: "bermudas",
    diveTime: 34,
    equipment: "None",
    decompressionTime: 0,
    maxDepth: 30,
  };
  const compliantResult = await createDive(compliantDive, {
    id: "alice-id",
    role: "member",
  });

  compliantDive["_id"] = "fake-id";
  expect(compliantResult).toHaveProperty("ok", true);
  expect(compliantResult).toHaveProperty("value", toDiveDto(compliantDive));
});

test("getDiveById returns a 404-shaped error when the dive does not exist", async () => {
  findById.mockResolvedValueOnce(null);

  const result = await getDiveById("non-existent-id");

  expect(result).toHaveProperty("ok", false);
  expect(result.error).toHaveProperty("status", 404);
  expect(result.error).toHaveProperty("message", "Dive not found");
});

test("getDiveById returns a DTO of the existing dive", async () => {
  const fakeDive = {
    _id: "507f1f77bcf86cd799439011",
    date: "04/23/2026",
    location: "Azores",
    diveTime: 45,
    equipment: "Scuba",
    decompressionTime: 10,
    maxDepth: 34,
    notes: "Saw turtles",
  };
  findById.mockResolvedValueOnce(fakeDive);

  const result = await getDiveById("507f1f77bcf86cd799439011", admin);

  expect(result).toHaveProperty("ok", true);
  expect(result.value).toStrictEqual(toDiveDto(fakeDive));
});

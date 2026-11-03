import { expect } from "@jest/globals";
import { jest } from "@jest/globals";

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
    const dives = await listDives("Azores");
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
  const dives = await listDives("Java");
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

  const dives = await listDives(undefined);
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

test("createDive returns DTO of compliant dive data", async () => {
  const compliantDive = {
    date: "2026/07/23",
    location: "bermudas",
    diveTime: 34,
    equipment: "None",
    decompressionTime: 0,
    maxDepth: 30,
  };
  const compliantResult = await createDive(compliantDive);

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

  const result = await getDiveById("507f1f77bcf86cd799439011");

  expect(result).toHaveProperty("ok", true);
  expect(result.value).toStrictEqual(toDiveDto(fakeDive));
});


import { getAll, create, findById, updateById, removeById } from "../repositories/divesRepository.js";
import { toDiveDto } from "../dtos/diveDto.js";

const validateDive = ({
  date,
  location,
  diveTime,
  equipment,
  decompressionTime,
  maxDepth,
  notes,
} = {}) => {
  if (!date || !diveTime || !maxDepth) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "date, dive time, and maximum depth are required",
      },
    };
  }

  if (
    !Number.isFinite(diveTime) ||
    diveTime <= 0 ||
    !Number.isFinite(maxDepth) ||
    maxDepth <= 0
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "dive time and maximum depth must be greater than 0",
      },
    };
  }

  if (
    decompressionTime !== null &&
    decompressionTime !== "" &&
    (!Number.isFinite(decompressionTime) || decompressionTime < 0)
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Decompression Time must be greater than or equal to 0",
      },
    };
  }

  return {
    ok: true,
    value: {
      date,
      location,
      diveTime,
      maxDepth,
      equipment,
      decompressionTime,
      notes,
    },
  };
};

const isOwnerOrAdmin = (dive, actor) => {
  if (dive.ownerId?.toString() === actor.id) return true;
  return actor.role === "admin";
};

export const listDives = async (location) => {
  const dives = await getAll();

  if (location) {
    const matchDives = dives.filter((dive) =>
      dive.location?.toLowerCase().includes(location.toLowerCase()),
    );
    return matchDives.map(toDiveDto);
  }

  return dives.map(toDiveDto);
};

export const createDive = async (data, actor) => {
  const result = validateDive(data);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    value: toDiveDto(await create({...result.value, ownerId: actor.id })),
  };
};

export const getDiveById = async (id) => {
  const dive = await findById(id);

  if (!dive) {
    return {
      ok: false,
      error: { status: 404, message: "Dive not found" },
    };
  }

  return {
    ok: true,
    value: toDiveDto(dive),
  };
};

export const getDiveForEdit = async (id, actor) => {
  const existing = await findById(id);
  if (!existing) {
    return { ok: false, error: { status: 404, message: "Dive not found" } };
  }
  if (!isOwnerOrAdmin(existing, actor)) {
    return {
      ok: false,
      error: { status: 403, message: "You do not have permission to modify this dive" },
    };
  }
  return { ok: true, value: toDiveDto(existing) };
};

export const updateDive = async (id, data, actor) => {
  const existing = await findById(id);
  if (!existing) {
    return { ok: false, error: { status: 404, message: "Dive not found" } };
  }
  if (!isOwnerOrAdmin(existing, actor)) {
    return {
      ok: false,
      error: { status: 403, message: "You do not have permission to modify this dive" },
    };
  }

  const result = validateDive(data);
  if (!result.ok) return result;
  return { ok: true, value: toDiveDto(await updateById(id, result.value)) };
};

export const deleteDive = async (id, actor) => {
  const existing = await findById(id);
  if (!existing) {
    return { ok: false, error: { status: 404, message: "Dive not found" } };
  }
  if (!isOwnerOrAdmin(existing, actor)) {
    return {
      ok: false,
      error: { status: 403, message: "You do not have permission to delete this dive" },
    };
  }
  await removeById(id);
  return { ok: true, value: null };
};
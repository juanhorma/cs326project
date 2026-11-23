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

  const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
    ? (() => {
        const [year, month, day] = date.split("-").map(Number);
        return new Date(year, month - 1, day);
      })()
    : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "date must be a valid date",
      },
    };
  }

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  if (parsedDate > endOfToday) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "date cannot be in the future",
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

export const listDives = async (location, actor) => {
  const dives = await getAll();

  const ownedDives = dives.filter(dive => isOwnerOrAdmin(dive, actor));

  if (location) {
    const matchDives = ownedDives.filter((dive) =>
      dive.location?.toLowerCase().includes(location.toLowerCase()),
    );
    return matchDives.map(toDiveDto);
  }

  return ownedDives.map(toDiveDto);
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

export const getDiveById = async (id, actor) => {
  const dive = await findById(id);

  if (!dive) {
    return {
      ok: false,
      error: { status: 404, message: "Dive not found" },
    };
  }

  if (!isOwnerOrAdmin(dive, actor)) {
    return {
      ok: false,
      error: { status: 403, message: "You do not have permission to see this dive" },
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

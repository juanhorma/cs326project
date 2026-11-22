import { getAll, create, findById } from "../repositories/divesRepository.js";
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

export const createDive = async (data) => {
  const result = validateDive(data);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    value: toDiveDto(await create(result.value)),
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

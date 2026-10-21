import { getAll, save } from "../repositories/divesRepository.js";
import { toDiveDto } from "../dtos/diveDto.js";

const validateDive = ({
  date,
  location,
  diveTime,
  equipment,
  decompressionTime,
  maxDepth,
  notes,
}) => {
  if (!date || !diveTime || !maxDepth) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "date, dive time, and maximum depth are required",
      },
    };
  }

  if (!Number.isFinite(diveTime) || diveTime <= 0 ||
      !Number.isFinite(maxDepth) || maxDepth <= 0
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "dive time and maximum depth must be greater than 0",
      },
    };
  }

  if (decompressionTime !== null &&
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
    const matchDives = dives.filter(
      dive => dive.location?.toLowerCase().includes(location.toLowerCase())
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

  const dives = await getAll();
  dives.push(toDiveDto(result.value));
  await save(dives);
  return {
    ok: true,
    value: toDiveDto(result.value),
  };
};

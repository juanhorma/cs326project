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

export const listDives = async () => (await getAll()).map(toDiveDto);

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

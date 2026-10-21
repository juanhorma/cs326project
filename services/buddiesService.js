import { getAll, save } from "../repositories/buddiesRepository.js";
import { toBuddyDto } from "../dtos/buddyDto.js";

const MAX_NAME_LENGTH = 100;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (status, message) => ({ ok: false, error: { status, message } });

const clean = (value) => (typeof value === "string" ? value.trim() : value);

const validateBuddy = (data) => { 
  // note for team: req.body is undefined when no JSON/form body was sent
  const { name, certification, email } = data ?? {};
  const cleaned = { 
    name: clean(name),
    certification: clean(certification) ?? "",
    email: clean(email) ?? "", 
  };

  if (typeof cleaned.name !== "string" || cleaned.name === "") {
    return fail(400, "name is required"); 
  }

  if (cleaned.name.length > MAX_NAME_LENGTH) {
    return fail(400, 'name must be ${MAX_NAME_LENGTH} characters or fewer');
  }

  if (typeof cleaned.certification !== "string") {
    return fail(400, "certification must be text");
  } 

  if (typeof cleaned.email !== "string") {
    return fail(400, "email must be text"); 
  }

  if (cleaned.email !== "" && !EMAIL_PATTERN.test(cleaned.email)) {
    return fail(400, "email must be a valid email address");
  }

  return { ok: true, value: cleaned }; 
};

export const listBuddies = async () => {
  const buddies = await getAll();
  return buddies.map(toBuddyDto);
};

export const createBuddy = async (data) => {
  const result = validateBuddy(data); 

  if (!result.ok) {
    return result;
  }

  const buddies = await getAll();

  const taken = buddies.some(
    (buddy) => buddy.name.toLowerCase() === result.value.name.toLowerCase(),
  );
  if (taken) {
    return fail(409, 'a dive buddy named "${result.value.name}" already exists');
  }

  buddies.push(toBuddyDto(result.value));
  await save(buddies);

  return { ok: true, value: toBuddyDto(result.value) };
};


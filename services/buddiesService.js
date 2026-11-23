import { getAll, create, findById, updateById, removeById } from "../repositories/buddiesRepository.js";
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
    return fail(400, `name must be ${MAX_NAME_LENGTH} characters or fewer`);
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

const isOwnerOrAdmin = (buddy, actor) => {
  if (buddy.ownerId?.toString() === actor.id) return true;
  return actor.role === "admin";
};

export const listBuddies = async (actor) => {
  const buddies = await getAll();
  const ownedBuddies = buddies.filter(buddy => isOwnerOrAdmin(buddy, actor));

  return ownedBuddies.map(toBuddyDto);
};

export const createBuddy = async (data, actor) => {
  const result = validateBuddy(data);

  if (!result.ok) {
    return result;
  }

  const buddies = await getAll();

  const taken = buddies.some(
    (buddy) => buddy.name.toLowerCase() === result.value.name.toLowerCase(),
  );
  if (taken) {
    return fail(
      409,
      `a dive buddy named "${result.value.name}" already exists`,
    );
  }

  return { ok: true, value: toBuddyDto(await create({ ...result.value, ownerId: actor.id })),};
};

export const getBuddyForEdit = async (id, actor) => {
  const existing = await findById(id);
  if (!existing) return fail(404, "Buddy not found");
  if (!isOwnerOrAdmin(existing, actor)) {
    return fail(403, "You do not have permission to modify this buddy");
  }
  return { ok: true, value: toBuddyDto(existing) };
};

export const updateBuddy = async (id, data, actor) => {
  const existing = await findById(id);
  if (!existing) return fail(404, "Buddy not found");
  if (!isOwnerOrAdmin(existing, actor)) {return fail(403, "You do not have permission to modify this buddy");}
  const result = validateBuddy(data);
  if (!result.ok) return result;
  const buddies = await getAll();
  const taken = buddies.some(
    (buddy) =>
      buddy._id.toString() !== existing._id.toString() &&
      buddy.name.toLowerCase() === result.value.name.toLowerCase(),
  );
  if (taken) {
    return fail(409, `a dive buddy named "${result.value.name}" already exists`);
  }

  return { ok: true, value: toBuddyDto(await updateById(id, result.value)) };
};

export const deleteBuddy = async (id, actor) => {
  const existing = await findById(id);
  if (!existing) return fail(404, "Buddy not found");
  if (!isOwnerOrAdmin(existing, actor)) {
    return fail(403, "You do not have permission to delete this buddy");
  }
  await removeById(id);
  return { ok: true, value: null };
};

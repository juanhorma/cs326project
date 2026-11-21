import bcrypt from "bcrypt";
import { Ok, Err } from "../result.js";
import * as usersRepository from "../repositories/usersRepository.js";
import { toUserDto } from "../dtos/userDto.js";

export const signup = async ({ email, password } = {}) => {
  const trimmedEmail = (email || "").trim().toLowerCase();

  if (!trimmedEmail || typeof password != "string" || !password) {
    return Err(400, "Email and password are required.");
  }

  const existing = await usersRepository.findByEmail(trimmedEmail);

  if (existing) {
    return Err(409, "Email is already registered.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = await usersRepository.create({
      email: trimmedEmail,
      passwordHash,
    });

    return Ok(toUserDto(user));
  } catch (error) {
    if (error.code === 11000) {
      return Err(409, "Email is already registered.");
    }
    throw error;
  }
};

export const login = async ({ email, password } = {}) => {
  const trimmedEmail = (email || "").trim().toLowerCase();

  const user = await usersRepository.findByEmail(trimmedEmail);

  if (!user) {
    return Err(401, "Incorrect email or password.");
  }

  const matches = await bcrypt.compare(
    typeof password === "string" ? password : "",
    user.passwordHash,
  );

  if (!matches) {
    return Err(401, "Incorrect email or password.");
  }

  return Ok(toUserDto(user));
};

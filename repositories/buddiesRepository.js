import mongoose from "mongoose";
import { readFile, writeFile } from "fs/promises";

const buddySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    certification: String,
    email: String,
  },
  { timestamps: true },
);

const Buddy = mongoose.model("Buddy", buddySchema);

// existing JSON operations
const DATA_FILE = "buddies.json";

export const getAll = async () => {
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

export const save = async (buddies) => {
  await writeFile(DATA_FILE, JSON.stringify(buddies, null, 2));
};

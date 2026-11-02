import mongoose from "mongoose";
import { readFile, writeFile } from "fs/promises";

const diveSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    location: String,
    diveTime: { type: Number, required: true },
    equipment: String,
    diveTime: { type: Number, required: true },
    notes: String,
  },
  { timestamps: true },
);

const Dive = mongoose.model("Dive", diveSchema);

// existing JSON operations
const DATA_FILE = "dives.json";

export const getAll = async () => {
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

export const save = async (dives) => {
  await writeFile(DATA_FILE, JSON.stringify(dives, null, 2));
};

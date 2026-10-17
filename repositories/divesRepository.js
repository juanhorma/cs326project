import { readFile, writeFile } from "fs/promises";

const DATA_FILE = "dives.json";

export const getAll = async () => {
  const data = await readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
};

export const save = async (dives) => {
  await writeFile(DATA_FILE, JSON.stringify(dives, null, 2));
};

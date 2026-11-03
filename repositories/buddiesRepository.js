import mongoose from "mongoose";

const buddySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    certification: String,
    email: String,
  },
  { timestamps: true },
);

const Buddy = mongoose.model("Buddy", buddySchema);

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAll = async () => Buddy.find().lean();

export const findById = async (id) => Buddy.findById(id).lean();

export const create = async (data) => (await Buddy.create(data)).toObject();

export const updateById = async (id, data) =>
  Buddy.findByIdAndUpdate(id, data, { new: true }).lean();

export const removeById = async (id) => {
  await Buddy.findByIdAndDelete(id);
};

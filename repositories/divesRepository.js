import mongoose from "mongoose";

const diveSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    location: String,
    diveTime: { type: Number, required: true },
    equipment: String,
    decompressionTime: Number,
    maxDepth: { type: Number, required: true },
    notes: String,
  },
  { timestamps: true },
);

const Dive = mongoose.model("Dive", diveSchema);

export const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getAll = async () => Dive.find().lean();

export const findById = async (id) => Dive.findById(id).lean();

export const create = async (data) => (await Dive.create(data)).toObject();

export const updateById = async (id, data) =>
  Dive.findByIdAndUpdate(id, data, { new: true }).lean();

export const removeById = async (id) => {
  await Dive.findByIdAndDelete(id);
};

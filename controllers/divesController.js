import * as divesService from "../services/divesService.js";

export const index = async (req, res) => {
  const dives = await divesService.listDives();
  res.status(200).render("dives", { dives });
};

export const create = async (req, res) => {
  const result = await divesService.createDive(req.body);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  res.status(201).json(result.value);
};

import * as buddiesService from "../services/buddiesService.js";

export const index = async (req, res) => {
  const buddies = await buddiesService.listBuddies();
  res.status(200).render("buddies", { buddies });
};

export const create = async (req, res) => {
  const result = await buddiesService.createBuddy(req.body);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  res.status(201).json(result.value);
};

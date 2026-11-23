import { isValidId } from "../repositories/buddiesRepository.js";
import * as buddiesService from "../services/buddiesService.js";

const fromHtmx = (req) => req.get('HX-Request') === 'true';

const sendError = (req, res, { status, message }) => {
  if (fromHtmx(req)) {
    res.status(status).send(message);
    return;
  }
  res.status(status).json({ error: message });
};
export const index = async (req, res) => {
  const buddies = await buddiesService.listBuddies(req.user);
  res.status(200).render("buddies", { buddies });
};

export const create = async (req, res) => {
  const result = await buddiesService.createBuddy(req.body, req.user);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  res.status(201).json(result.value);
};


export const destroy = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return sendError(req, res, { status: 400, message: "Invalid buddy ID" });
  }
  const result = await buddiesService.deleteBuddy(id, req.user);
  if (!result.ok) return sendError(req, res, result.error);
  res.status(200).send("");
};

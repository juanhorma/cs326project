import { isValidId } from "../repositories/divesRepository.js";
import * as divesService from "../services/divesService.js";

// htmx marks every request it sends with an HX-Request header. Those get a
// piece of HTML to swap into the page; anything else (curl, a test, another
// program) still gets JSON, the same as before.
const fromHtmx = (req) => req.get('HX-Request') === 'true';

export const index = async (req, res) => {
  const location = req.query.location;

  const dives = await divesService.listDives(location);
  if (fromHtmx(req)) {
    res.status(200).render("partials/dive-list", { dives });
    return;
  }
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

export const show = async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    res.status(400).json({ error: "Invalid dive ID" });
    return;
  }

  const result = await divesService.getDiveById(id);

  if (!result.ok) {
    res.status(result.error.status).json({
      error: result.error.message,
    });
    return;
  }

  res.status(200).json(result.value);
};

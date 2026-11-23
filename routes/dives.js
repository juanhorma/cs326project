import { Router } from "express";
import * as divesController from "../controllers/divesController.js";
import { asyncHandler } from "../asyncHandler.js";
import { requireLogin } from "../middleware/requireLogin.js";

const router = Router();

router.get("/", asyncHandler(divesController.index));

router.post("/", asyncHandler(divesController.create));

router.get("/:id", asyncHandler(divesController.show));

router.delete("/:id", requireLogin, asyncHandler(divesController.destroy));

export default router;

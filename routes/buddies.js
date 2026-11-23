import { Router } from "express";
import * as buddiesController from "../controllers/buddiesController.js";
import { requireLogin } from "../middleware/requireLogin.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(buddiesController.index));

router.post("/", asyncHandler(buddiesController.create));

router.delete("/:id", requireLogin, asyncHandler(buddiesController.destroy));

export default router;

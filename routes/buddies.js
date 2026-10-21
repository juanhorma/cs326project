import { Router } from "express";
import * as buddiesController from "../controllers/buddiesController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(buddiesController.index));

router.post("/", asyncHandler(buddiesController.create));

export default router;

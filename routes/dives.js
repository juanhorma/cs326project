import { Router } from "express";
import * as divesController from "../controllers/divesController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(divesController.create));

export default router;

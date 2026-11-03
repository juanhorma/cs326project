import { Router } from "express";
import * as divesController from "../controllers/divesController.js";
import { asyncHandler } from "../asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(divesController.index));

router.post("/", asyncHandler(divesController.create));

router.get("/:id", asyncHandler(divesController.show));

export default router;


import { Router } from "express";
import {
  getExperiences,
  getExperience,
  createExperienceHandler,
  updateExperienceHandler,
  deleteExperienceHandler,
} from "./experience.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getExperiences);
router.get("/:id", getExperience);

router.post("/", authenticate, createExperienceHandler);
router.put("/:id", authenticate, updateExperienceHandler);
router.delete("/:id", authenticate, deleteExperienceHandler);

export default router;

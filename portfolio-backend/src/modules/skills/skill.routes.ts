
import { Router } from "express";
import { createSkillHandler, deleteSkillHandler, getSkillByIdHandler, getSkills, updateSkillHandler } from "./skill.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getSkills);

export default router;

router.get("/:id", getSkillByIdHandler);

// PROTECTED ROUTES
router.post("/", authenticate, createSkillHandler);
router.put("/:id", authenticate, updateSkillHandler);
router.delete("/:id", authenticate, deleteSkillHandler);
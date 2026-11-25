
import { Router } from "express";
import {
    getProjects,
    getProject,
    createProjectHandler,
    updateProjectHandler,
    deleteProjectHandler,
} from "./project.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", getProjects);
router.get("/:slug", getProject);

// Protected admin routes
router.post("/", authenticate, createProjectHandler);
router.put("/:id", authenticate, updateProjectHandler);
router.delete("/:id", authenticate, deleteProjectHandler);

export default router;

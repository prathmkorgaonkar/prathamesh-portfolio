
import { Router } from "express";
import {
  register,
  login,
  getProfile,
} from "./auth.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/profile", authenticate, getProfile);

export default router;

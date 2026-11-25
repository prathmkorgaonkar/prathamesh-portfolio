import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { getDashboardStatsHandler } from "./dashboard.controller.js";


const router = Router();

// Admin protected
router.get("/stats", authenticate, getDashboardStatsHandler);

export default router;
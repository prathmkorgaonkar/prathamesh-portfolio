import type { RequestHandler } from "express";

import { getDashboardStats } from "./dashboard.service.js";

export const getDashboardStatsHandler: RequestHandler = async (req, res, next) => {
    try {
        const dashboard = await getDashboardStats();

        res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully",
            data: dashboard,
        });
    } catch (error) {
        next(error);
    }
};
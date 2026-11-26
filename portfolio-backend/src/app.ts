
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import projectRoutes from "./modules/projects/project.routes.js";
import skillRoutes from "./modules/skills/skill.routes.js";
import experienceRoutes from "./modules/experience/experience.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Portfolio API is running successfully",
        timestamp: new Date().toISOString(),
    });
});
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

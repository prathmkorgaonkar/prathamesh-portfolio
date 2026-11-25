
import type { RequestHandler } from "express";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectBySlug,
    updateProject,
} from "./project.service.js";
import z from "zod";


const projectSchema = z.object({
    title: z.string().trim().min(2).max(150),
    slug: z.string().trim().min(2).max(180)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    description: z.string().trim().min(10),
    imageUrl: z.string().trim().max(500).optional(),
    techStack: z.array(z.string().trim().min(1)).default([]),
    githubUrl: z.string().url().max(500).optional().or(z.literal("")),
    liveUrl: z.string().url().max(500).optional().or(z.literal("")),
    featured: z.boolean().default(false),
    displayOrder: z.number().int().min(0).default(0),
});


export const getProjects: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            100,
            Math.max(1, Number(req.query.limit) || 10)
        );

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : undefined;

        const featured =
            req.query.featured === "true"
                ? true
                : req.query.featured === "false"
                    ? false
                    : undefined;

        const result = await getAllProjects({
            page,
            limit,
            search,
            featured,
        });

        res.status(200).json({
            success: true,
            message: "Projects fetched successfully",
            data: result.projects,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

export const getProject: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const project = await getProjectBySlug(String(req.params.slug));

        res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};


export const createProjectHandler: RequestHandler = async (req, res, next) => {
    try {
        const validation = projectSchema.safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
            return;
        }

        const project = await createProject(validation.data);

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProjectHandler: RequestHandler = async (req, res, next) => {
    try {
        const validation = projectSchema.partial().safeParse(req.body);

        if (!validation.success) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues,
            });
            return;
        }

        const project = await updateProject(
            String(req.params.id),
            validation.data
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProjectHandler: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        await deleteProject(String(req.params.id));

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};


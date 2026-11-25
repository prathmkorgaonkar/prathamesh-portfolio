
import type { RequestHandler } from "express";
import {
    createExperience,
    deleteExperience,
    getAllExperiences,
    getExperienceById,
    updateExperience,
} from "./experience.service.js";
import { createExperienceSchema, experienceIdSchema, updateExperienceSchema } from "../../validations/experience.validation.js";

export const getExperiences: RequestHandler = async (req, res, next) => {
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

        const isCurrent =
            req.query.isCurrent === "true"
                ? true
                : req.query.isCurrent === "false"
                    ? false
                    : undefined;

        const result = await getAllExperiences({
            page,
            limit,
            search,
            isCurrent,
        });

        res.status(200).json({
            success: true,
            message: "Experiences fetched successfully",
            data: result.experiences,
            pagination: result.pagination,
        });
    } catch (error) {
        next(error);
    }
};

export const getExperience: RequestHandler = async (req, res, next) => {
    try {
        const experience = await getExperienceById(String(req.params.id));

        res.status(200).json({
            success: true,
            message: "Experience fetched successfully",
            data: experience,
        });
    } catch (error) {
        next(error);
    }
};

// CREATE
export const createExperienceHandler: RequestHandler = async (req, res, next) => {
    try {
        const data = createExperienceSchema.parse(req.body);
        const experience = await createExperience(data);

        res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: experience,
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE
export const updateExperienceHandler: RequestHandler = async (req, res, next) => {
    try {
        const id = experienceIdSchema.parse(req.params.id);
        const data = updateExperienceSchema.parse(req.body);

        const experience = await updateExperience(id, data);

        res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: experience,
        });
    } catch (error) {
        next(error);
    }
};

// DELETE
export const deleteExperienceHandler: RequestHandler = async (req, res, next) => {
    try {
        const id = experienceIdSchema.parse(req.params.id);
        const result = await deleteExperience(id);

        res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        next(error);
    }
};
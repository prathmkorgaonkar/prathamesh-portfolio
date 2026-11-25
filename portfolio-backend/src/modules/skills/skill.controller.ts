
import type { RequestHandler } from "express";
import { createSkill, deleteSkill, getAllSkills, getSkillById, updateSkill } from "./skill.service.js";
import z from "zod";
import { createSkillSchema, skillIdSchema, updateSkillSchema } from "../../validations/skill.validation.js";


export const getSkills: RequestHandler = async (req, res, next) => {
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

    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : undefined;

    const result = await getAllSkills({
      page,
      limit,
      search,
      category,
    });

    res.status(200).json({
      success: true,
      message: "Skills fetched successfully",
      data: result.skills,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

// CREATE SKILL
export const createSkillHandler: RequestHandler = async (req, res, next) => {
  try {
    const data = createSkillSchema.parse(req.body);

    const skill = await createSkill(data);

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// GET SKILL BY ID
export const getSkillByIdHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = skillIdSchema.parse(req.params.id);

    const skill = await getSkillById(id);

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE SKILL
export const updateSkillHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = skillIdSchema.parse(req.params.id);

    const data = updateSkillSchema.parse(req.body);

    const skill = await updateSkill(id, data);

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE SKILL
export const deleteSkillHandler: RequestHandler = async (req, res, next) => {
  try {
    const id = skillIdSchema.parse(req.params.id);

    const result = await deleteSkill(id);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

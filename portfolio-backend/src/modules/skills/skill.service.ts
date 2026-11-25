
import { AppDataSource } from "../../database/data-source.js";
import { Skill } from "../../database/entities/skill.entity.js";
import type { CreateSkillInput, UpdateSkillInput } from "../../types/skill.types.js";
import { AppError } from "../../utils/appError.js";
import type { CreateSkillData } from "../../validations/skill.validation.js";

const skillRepository = AppDataSource.getRepository(Skill);

interface GetSkillsOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  category?: string | undefined;
}

export const getAllSkills = async ({ page, limit, search, category, }: GetSkillsOptions) => {
  const query = skillRepository
    .createQueryBuilder("skill")
    .where("skill.isActive = :isActive", { isActive: true });

  if (search) {
    query.andWhere("skill.name ILIKE :search", {
      search: `%${search}%`,
    });
  }

  if (category) {
    query.andWhere("skill.category ILIKE :category", {
      category,
    });
  }

  query
    .orderBy("skill.displayOrder", "ASC")
    .addOrderBy("skill.name", "ASC")
    .skip((page - 1) * limit)
    .take(limit);

  const [skills, total] = await query.getManyAndCount();

  return {
    skills,
    pagination: {
      total, page, limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// CREATE SKILL
export const createSkill = async (data: CreateSkillData) => {
  const skill = skillRepository.create({
    name: data.name,
    category: data.category,
    proficiency: data.proficiency,
    displayOrder: data.displayOrder,
    isActive: data.isActive,
  });

  return await skillRepository.save(skill);
};

// GET SKILL BY ID
export const getSkillById = async (id: string) => {
  const skill = await skillRepository.findOneBy({ id });

  if (!skill) {
    throw new AppError("Skill not found", 404);
  }

  return skill;
};

// UPDATE SKILL
export const updateSkill = async (
  id: string,
  data: UpdateSkillInput
) => {
  const skill = await skillRepository.findOneBy({ id });

  if (!skill) {
    throw new AppError("Skill not found", 404);
  }

  if (data.name !== undefined) {
    skill.name = data.name;
  }

  if (data.category !== undefined) {
    skill.category = data.category;
  }

  if (data.proficiency !== undefined) {
    skill.proficiency = data.proficiency;
  }

  if (data.displayOrder !== undefined) {
    skill.displayOrder = data.displayOrder;
  }

  if (data.isActive !== undefined) {
    skill.isActive = data.isActive;
  }

  return await skillRepository.save(skill);
};

export const deleteSkill = async (id: string) => {
  const skill = await skillRepository.findOneBy({ id });

  if (!skill) {
    throw new AppError("Skill not found", 404);
  }

  await skillRepository.remove(skill);

  return { message: "Skill deleted successfully" };
};
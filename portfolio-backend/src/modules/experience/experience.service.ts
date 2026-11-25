
import { AppDataSource } from "../../database/data-source.js";
import { Experience } from "../../database/entities/experience.entity.js";
import { AppError } from "../../utils/appError.js";
import type { CreateExperienceData, UpdateExperienceInput } from "../../validations/experience.validation.js";

const experienceRepository =
  AppDataSource.getRepository(Experience);

interface GetExperiencesOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  isCurrent?: boolean | undefined;
}

export const getAllExperiences = async ({
  page,
  limit,
  search,
  isCurrent,
}: GetExperiencesOptions) => {
  const query = experienceRepository
    .createQueryBuilder("experience");

  if (search) {
    query.andWhere(
      `(experience.companyName ILIKE :search
      OR experience.designation ILIKE :search)`,
      { search: `%${search}%` }
    );
  }

  if (isCurrent !== undefined) {
    query.andWhere(
      "experience.isCurrent = :isCurrent",
      { isCurrent }
    );
  }

  query
    .orderBy("experience.displayOrder", "ASC")
    .addOrderBy("experience.startDate", "DESC")
    .skip((page - 1) * limit)
    .take(limit);

  const [experiences, total] = await query.getManyAndCount();

  return {
    experiences,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getExperienceById = async (id: string) => {
  const experience = await experienceRepository.findOne({
    where: { id },
  });

  if (!experience) {
    throw new AppError("Experience not found", 404);
  }

  return experience;
};

// CREATE
export const createExperience = async (
  data: CreateExperienceData
) => {
  const experience = experienceRepository.create({
    companyName: data.companyName,
    designation: data.designation,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate ?? null,
    isCurrent: data.isCurrent,
    technologies: data.technologies,
    displayOrder: data.displayOrder,
  });

  return await experienceRepository.save(experience);
};

// UPDATE
export const updateExperience = async (
  id: string,
  data: UpdateExperienceInput
) => {
  const experience = await experienceRepository.findOneBy({ id });

  if (!experience) {
    throw new AppError("Experience not found", 404);
  }

  if (data.companyName !== undefined) {
    experience.companyName = data.companyName;
  }

  if (data.designation !== undefined) {
    experience.designation = data.designation;
  }

  if (data.description !== undefined) {
    experience.description = data.description;
  }

  if (data.startDate !== undefined) {
    experience.startDate = data.startDate;
  }

  if (data.endDate !== undefined) {
    experience.endDate = data.endDate;
  }

  if (data.isCurrent !== undefined) {
    experience.isCurrent = data.isCurrent;
  }

  if (data.technologies !== undefined) {
    experience.technologies = data.technologies;
  }

  if (data.displayOrder !== undefined) {
    experience.displayOrder = data.displayOrder;
  }

  // Validate the final combined dates and current status.
  if (
    !experience.isCurrent &&
    experience.endDate === null
  ) {
    throw new AppError(
      "End date is required when experience is not current",
      400
    );
  }

  if (
    experience.endDate !== null &&
    experience.endDate < experience.startDate
  ) {
    throw new AppError(
      "End date cannot be before start date",
      400
    );
  }

  return await experienceRepository.save(experience);
};

// DELETE
export const deleteExperience = async (id: string) => {
  const experience = await experienceRepository.findOneBy({ id });

  if (!experience) {
    throw new AppError("Experience not found", 404);
  }

  await experienceRepository.remove(experience);

  return { message: "Experience deleted successfully" };
};

import { AppDataSource } from "../../database/data-source.js";
import { Project } from "../../database/entities/project.entity.js";
import type { CreateProjectInput, UpdateProjectInput } from "../../types/project.types.js";
import { AppError } from "../../utils/appError.js";

const projectRepository = AppDataSource.getRepository(Project);

interface GetProjectsOptions {
  page: number;
  limit: number;
  search?: string | undefined;
  featured?: boolean | undefined;
}

export const getAllProjects = async ({
  page,
  limit,
  search,
  featured,
}: GetProjectsOptions) => {
  const query = projectRepository.createQueryBuilder("project");

  if (search) {
    query.andWhere(
      "(project.title ILIKE :search OR project.description ILIKE :search)",
      { search: `%${search}%` }
    );
  }

  if (featured !== undefined) {
    query.andWhere("project.featured = :featured", { featured });
  }

  query
    .orderBy("project.displayOrder", "ASC")
    .addOrderBy("project.createdAt", "DESC")
    .skip((page - 1) * limit)
    .take(limit);

  const [projects, total] = await query.getManyAndCount();

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProjectBySlug = async (slug: string) => {
  const project = await projectRepository.findOne({
    where: { slug },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  return project;
};

export const createProject = async (
  data: CreateProjectInput
) => {
  const existingProject = await projectRepository.findOne({
    where: { slug: data.slug },
  });

  if (existingProject) {
    throw new AppError("Project slug already exists", 409);
  }

  const project = projectRepository.create({
    title: data.title,
    slug: data.slug,
    description: data.description,
    imageUrl: data.imageUrl ?? null,
    techStack: data.techStack,
    githubUrl: data.githubUrl ?? null,
    liveUrl: data.liveUrl ?? null,
    featured: data.featured ?? false,
    displayOrder: data.displayOrder ?? 0,
  });

  return await projectRepository.save(project);
};

export const updateProject = async (
  id: string,
  data: UpdateProjectInput
) => {
  const project = await projectRepository.findOne({
    where: { id },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (data.slug && data.slug !== project.slug) {
    const existingProject = await projectRepository.findOne({
      where: { slug: data.slug },
    });

    if (existingProject) {
      throw new AppError("Project slug already exists", 409);
    }
  }

  Object.assign(project, {
    ...data,
    imageUrl: data.imageUrl ?? project.imageUrl,
    githubUrl: data.githubUrl ?? project.githubUrl,
    liveUrl: data.liveUrl ?? project.liveUrl,
  });

  return await projectRepository.save(project);
};

export const deleteProject = async (id: string) => {
  const project = await projectRepository.findOne({
    where: { id },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  await projectRepository.remove(project);
};

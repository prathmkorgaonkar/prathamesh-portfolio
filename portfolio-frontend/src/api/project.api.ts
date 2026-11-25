
import type { Project, ProjectInput, ProjectResponse } from "../types/project";
import axiosInstance from "./axiosInstance";

// Get all projects
export const getAllProjects = async (): Promise<ProjectResponse> => {
  const response = await axiosInstance.get<ProjectResponse>("/projects");
  return response.data;
};

// Get project by slug
export const getProjectBySlug = async (slug: string) => {
  const response = await axiosInstance.get<{ success: boolean; data: Project }>(
    `/projects/${slug}`
  );

  return response.data;
};

// Create project
export const createProject = async (data: ProjectInput) => {
  const response = await axiosInstance.post("/projects", data);
  return response.data;
};

// Update project
export const updateProject = async (
  id: string,
  data: Partial<ProjectInput>
) => {
  const response = await axiosInstance.put(`/projects/${id}`, data);
  return response.data;
};

// Delete project
export const deleteProject = async (id: string) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};

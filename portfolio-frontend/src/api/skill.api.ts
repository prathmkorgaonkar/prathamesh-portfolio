
import type { SkillInput, SkillResponse } from "../types/skill";
import axiosInstance from "./axiosInstance";

// Get all skills with pagination
export const getAllSkills = async (params?: { page?: number; limit?: number; }): Promise<SkillResponse> => {
  const response = await axiosInstance.get<SkillResponse>(
    "/skills",
    { params }
  );
  return response.data;
};

// Public: Get all skills for portfolio
export const getPublicSkills = async (): Promise<SkillResponse> => {
  const response = await axiosInstance.get<SkillResponse>(
    "/skills", { params: { page: 1, limit: 100, }, });
  return response.data;
};

// Create skill
export const createSkill = async (data: SkillInput) => {
  const response = await axiosInstance.post("/skills", data);
  return response.data;
};

// Update skill
export const updateSkill = async (
  id: string,
  data: Partial<SkillInput>
) => {
  const response = await axiosInstance.put(`/skills/${id}`, data);
  return response.data;
};

// Delete skill
export const deleteSkill = async (id: string) => {
  const response = await axiosInstance.delete(`/skills/${id}`);
  return response.data;
};

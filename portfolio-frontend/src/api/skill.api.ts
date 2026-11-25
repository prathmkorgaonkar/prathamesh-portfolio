
import type { SkillInput, SkillResponse } from "../types/skill";
import axiosInstance from "./axiosInstance";

// Get all skills
export const getAllSkills = async (): Promise<SkillResponse> => {
  const response = await axiosInstance.get<SkillResponse>("/skills");
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

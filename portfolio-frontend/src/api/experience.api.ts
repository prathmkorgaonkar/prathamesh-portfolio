
import axiosInstance from "./axiosInstance";

import type {
  Experience,
  ExperienceInput,
  ExperienceResponse,
} from "../types/experience";

// Get all experiences
export const getAllExperiences = async (): Promise<ExperienceResponse> => {
  const response = await axiosInstance.get<ExperienceResponse>(
    "/experiences"
  );

  return response.data;
};

// Get experience by ID
export const getExperienceById = async (id: string) => {
  const response = await axiosInstance.get<{
    success: boolean;
    data: Experience;
  }>(`/experiences/${id}`);

  return response.data;
};

// Create experience
export const createExperience = async (data: ExperienceInput) => {
  const response = await axiosInstance.post("/experiences", data);

  return response.data;
};

// Update experience
export const updateExperience = async (
  id: string,
  data: Partial<ExperienceInput>
) => {
  const response = await axiosInstance.put(`/experiences/${id}`, data);

  return response.data;
};

// Delete experience
export const deleteExperience = async (id: string) => {
  const response = await axiosInstance.delete(`/experiences/${id}`);

  return response.data;
};

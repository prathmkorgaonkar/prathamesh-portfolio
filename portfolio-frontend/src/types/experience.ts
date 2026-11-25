
export interface Experience {
  id: string;
  companyName: string;
  designation: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  technologies: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Used when creating or updating experience
export interface ExperienceInput {
  companyName: string;
  designation: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  technologies: string[];
  displayOrder?: number;
}

export interface ExperienceResponse {
  success: boolean;
  count: number;
  data: Experience[];
}

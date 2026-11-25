
export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Used for creating and updating skills
export interface SkillInput {
  name: string;
  category: string;
  proficiency: number;
  displayOrder?: number;
  isActive?: boolean;
}

export interface SkillResponse {
  success: boolean;
  count: number;
  data: Skill[];
}

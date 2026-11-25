
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  techStack: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Used when creating or updating a project
export interface ProjectInput {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string | null;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  displayOrder?: number;
}

export interface ProjectResponse {
  success: boolean;
  data: Project[];
}

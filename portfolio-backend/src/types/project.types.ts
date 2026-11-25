export interface CreateProjectInput {
    title: string;
    slug: string;
    description: string;
    imageUrl?: string | undefined;
    techStack: string[];
    githubUrl?: string | undefined;
    liveUrl?: string | undefined;
    featured?: boolean | undefined;
    displayOrder?: number | undefined;
}

export interface UpdateProjectInput {
    title?: string | undefined;
    slug?: string | undefined;
    description?: string | undefined;
    imageUrl?: string | null | undefined;
    techStack?: string[] | undefined;
    githubUrl?: string | null | undefined;
    liveUrl?: string | null | undefined;
    featured?: boolean | undefined;
    displayOrder?: number | undefined;
}
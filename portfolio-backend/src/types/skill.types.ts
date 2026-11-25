export interface CreateSkillInput {
    name: string;
    category: string;
    proficiency?: number | undefined;
    displayOrder?: number | undefined;
    isActive?: boolean | undefined;
};

export interface UpdateSkillInput {
    name?: string | undefined;
    category?: string | undefined;
    proficiency?: number | undefined;
    displayOrder?: number | undefined;
    isActive?: boolean | undefined;
};
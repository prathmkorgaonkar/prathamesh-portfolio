import { z } from "zod";

export const createSkillSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.string().trim().min(1).max(50),
  proficiency: z.number().int().min(0).max(100).default(0),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const updateSkillSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  category: z.string().trim().min(1).max(50).optional(),
  proficiency: z.number().int().min(0).max(100).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" }
);

export const skillIdSchema = z.string().uuid();

// Input types before Zod applies defaults
export type CreateSkillInput = z.input<typeof createSkillSchema>;

// Validated output after Zod applies defaults
export type CreateSkillData = z.output<typeof createSkillSchema>;

export type UpdateSkillInput = z.output<typeof updateSkillSchema>;
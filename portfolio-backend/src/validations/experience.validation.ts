import { z } from "zod";

export const createExperienceSchema = z.object({
  companyName: z.string().trim().min(1).max(150),
  designation: z.string().trim().min(1).max(150),
  description: z.string().min(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  isCurrent: z.boolean().default(false),
  technologies: z.array(z.string().trim().min(1)).default([]),
  displayOrder: z.number().int().default(0),
}).refine(
  (data) => data.isCurrent || data.endDate != null,
  {
    message: "End date is required when experience is not current",
    path: ["endDate"],
  }
).refine(
  (data) => data.endDate == null || data.endDate >= data.startDate,
  {
    message: "End date cannot be before start date",
    path: ["endDate"],
  }
);

export const updateExperienceSchema = z.object({
  companyName: z.string().trim().min(1).max(150).optional(),
  designation: z.string().trim().min(1).max(150).optional(),
  description: z.string().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().nullable().optional(),
  isCurrent: z.boolean().optional(),
  technologies: z.array(z.string().trim().min(1)).optional(),
  displayOrder: z.number().int().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field is required" }
);

export const experienceIdSchema = z.string().uuid();

export type CreateExperienceData =
  z.output<typeof createExperienceSchema>;

export type UpdateExperienceInput =
  z.output<typeof updateExperienceSchema>;
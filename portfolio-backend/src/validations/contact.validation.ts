import { z } from "zod";

export const contactIdSchema = z.string().uuid();

export const contactQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  isRead: z.enum(["true", "false"]).optional(),
  search: z.string().trim().optional(),
});

export type ContactQueryInput = z.output<
  typeof contactQuerySchema
>;
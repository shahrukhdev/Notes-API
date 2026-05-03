import { z } from "zod";

export const categorySchema = z.object({
  title: z
    .string({ message: 'Title field is required' })
    .min(2, 'Title must be at least 2 characters'),
});

export const updateCategorySchema = z.object({
  title: z.string().min(2).optional(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CategoryInput = z.infer<typeof categorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
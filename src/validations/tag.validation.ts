import { z } from "zod";

export const tagSchema = z
  .object({
    name: z
      .string({ message: 'Name field is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must not exceed 50 characters'),
    isActive: z.boolean().optional(),
  });

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type TagInput = z.infer<typeof tagSchema>;
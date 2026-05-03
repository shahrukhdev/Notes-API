import { z } from "zod";

export const noteSchema = z
  .object({
    title: z
      .string({ message: 'Title field is required' })
      .min(2, 'Title must be at least 2 characters')
      .max(50, 'Title must not exceed 50 characters'),
    content: z
      .string({ message: 'Content field is required' })
      .min(2, 'Content must be at least 2 characters'),
    category: z.string().optional(),
    tagIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    isPinned: z.boolean().optional(),
    isArchived: z.boolean().optional(),
  });

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type NoteInput = z.infer<typeof noteSchema>;
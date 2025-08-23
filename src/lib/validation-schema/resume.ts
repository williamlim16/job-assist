import z from "zod";

export const createEditResumeSchema = z.object({
  id: z.number().optional(),
  title: z.string({ description: "Title is required" }),
  content: z.string({ description: "Content is required" }),
});

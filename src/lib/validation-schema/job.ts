import z from "zod";

export const createEditJobSchema = z.object({
  id: z.number().optional(),
  url: z.string().optional(),
  description: z.string({ description: "Description is required" }),
  title: z.string({ description: "Title is required" }),
  resumeId: z.number().optional(),
  coverLetter: z.string().optional(),
});

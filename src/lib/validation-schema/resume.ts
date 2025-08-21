import z from "zod";

export const createResumeSchema = z.object({
  title: z.string("Title is required"),
  content: z.string("Content is required"),
});

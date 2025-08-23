"use server";

import { createResumeSchema } from "@/lib/validation-schema/resume";
import { parseWithZod } from "@conform-to/zod";
import { ResumeRepository } from "../repository/resume-repository";

export async function createResume(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: createResumeSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const resumeRepository = new ResumeRepository();
  resumeRepository.save(submission.value).catch((error) => {
    return submission.reply({
      formErrors: [`Database error ${error}`],
    });
  });
}

export async function getResume() {
  const resumeRepository = new ResumeRepository();
  return await resumeRepository.findMany({});
}

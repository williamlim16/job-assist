"use server";

import { parseWithZod } from "@conform-to/zod";
import { JobRepository } from "../repository/job-repository";
import type { SelectResume } from "../db/schema";
import { createEditJobSchema } from "@/lib/validation-schema/job";

export async function createEditJob(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: createEditJobSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const jobRepository = new JobRepository();

  if (submission.value.id) {
    jobRepository
      .update(submission.value.id, {
        description: submission.value.description,
        title: submission.value.title,
        url: submission.value.url,
        resumeId: submission.value.resumeId,
      })
      .catch((error) => {
        return submission.reply({
          formErrors: [`Database error ${error}`],
        });
      });
    return;
  }
  jobRepository
    .save({
      title: submission.value.title,
      description: submission.value.description,
    })
    .catch((error) => {
      return submission.reply({
        formErrors: [`Database error ${error}`],
      });
    });
}

export async function getJobList() {
  const resumeRepository = new JobRepository();
  return await resumeRepository.findMany({});
}

export async function getJobById(id: SelectResume["id"]) {
  const resumeRepository = new JobRepository();
  return await resumeRepository.findById(id);
}

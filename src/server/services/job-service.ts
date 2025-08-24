"use server";

import { parseWithZod } from "@conform-to/zod";
import { JobRepository } from "../repository/job-repository";
import type { SelectJob, SelectResume } from "../db/schema";
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

export async function getJobById(id: SelectJob["id"]) {
  const resumeRepository = new JobRepository();
  return await resumeRepository.findById(id);
}

export async function saveResumeReference(
  resumeId: SelectResume["id"],
  jobId: SelectJob["id"],
) {
  const jobRepository = new JobRepository();
  jobRepository
    .update(jobId, {
      resumeId: resumeId,
    })
    .catch((error) => {
      console.error(error);
      return {
        success: false,
        error: "Error database",
      };
    });

  return {
    success: true,
    error: undefined,
  };
}

"use server";

import { parseWithZod } from "@conform-to/zod";
import { JobRepository } from "../repository/job-repository";
import { resume, type SelectJob, type SelectResume } from "../db/schema";
import { createEditJobSchema } from "@/lib/validation-schema/job";
import { success } from "better-auth";
import { revalidatePath } from "next/cache";
import type { SQLiteSelectJoin } from "drizzle-orm/sqlite-core";
import { ResumeRepository } from "../repository/resume-repository";

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
        coverLetter: submission.value.coverLetter,
        companyName: submission.value.companyName,
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
      description: submission.value.description,
      title: submission.value.title,
      url: submission.value.url,
      resumeId: submission.value.resumeId,
      coverLetter: submission.value.coverLetter,
      companyName: submission.value.companyName,
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

export async function deleteJobById(id: SelectJob["id"]) {
  const jobRepository = new JobRepository();

  revalidatePath("/dashboard/job");
  jobRepository.delete(id).catch((error) => {
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

export async function generateCoverLetter(id: SelectJob["id"]) {
  try {
    const jobRepository = new JobRepository();
    const resumeRepository = new ResumeRepository();
    const job = await jobRepository.findById(id);
    if (!job) {
      console.error("Error, job not found");
      return {
        success: false,
        error: "Job not found",
      };
    }

    if (!job.resumeId) {
      console.error("Error, resume ID not found");
      return {
        success: false,
        error: "Resume ID not found",
      };
    }

    const resume = await resumeRepository.findById(job.resumeId);

    if (!resume) {
      console.error("Error, job not found");
      return {
        success: false,
        error: "Resume not found",
      };
    }

    const prompt = `
    You are a cover letter expert, please write a cover letter for this job
    name = ${job.title}
    description = ${job.description}
    with this resume
    ${resume.content}`;

    const response = await jobRepository.generateCoverLetter(prompt);

    if (!response) {
      return {
        success: false,
        error: "Resume not found",
      };
    }

    await jobRepository.update(id, {
      coverLetter: response,
    });
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Cover letter generation failed",
    };
  }
}

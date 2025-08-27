"use server";

import { createEditResumeSchema } from "@/lib/validation-schema/resume";
import { parseWithZod } from "@conform-to/zod";
import { ResumeRepository } from "../repository/resume-repository";
import type { SelectResume } from "../db/schema";
import { revalidatePath } from "next/cache";

export async function createEditResume(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: createEditResumeSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }
  const resumeRepository = new ResumeRepository();

  console.log(submission.value);
  if (submission.value.id) {
    resumeRepository
      .update(submission.value.id, {
        content: submission.value.content,
        title: submission.value.title,
      })
      .catch((error) => {
        return submission.reply({
          formErrors: [`Database error ${error}`],
        });
      });
    return;
  }
  resumeRepository
    .save({
      filePath: "",
      title: submission.value.title,
      content: submission.value.content,
    })
    .catch((error) => {
      return submission.reply({
        formErrors: [`Database error ${error}`],
      });
    });
}

export async function getResumeList() {
  const resumeRepository = new ResumeRepository();
  return await resumeRepository.findMany({});
}

export async function getResumeById(id: SelectResume["id"]) {
  const resumeRepository = new ResumeRepository();
  return await resumeRepository.findById(id);
}

export async function deleteResumeById(id: SelectResume["id"]) {
  const resumeRepository = new ResumeRepository();

  revalidatePath("/dashboard/resume");

  resumeRepository.delete(id).catch((error) => {
    console.error(error);
    return {
      success: false,
      error: "Database error",
    };
  });

  return {
    success: true,
    error: undefined,
  };
}

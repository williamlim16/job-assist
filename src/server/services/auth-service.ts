"use server";

import { loginSchema, registerSchema } from "@/lib/validation-schema/auth";
import { parseWithZod } from "@conform-to/zod";
import { auth } from "../auth";

export async function registerUser(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: registerSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await auth.api.signUpEmail({
    body: {
      email: submission.value.email,
      password: submission.value.password,
      name: submission.value.name,
    },
  });
}

export async function loginUser(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: loginSchema,
  });
  if (submission.status !== "success") {
    return submission.reply();
  }

  await auth.api.signInEmail({
    body: {
      email: submission.value.email,
      password: submission.value.password,
    },
  });
}

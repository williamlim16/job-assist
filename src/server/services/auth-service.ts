"use server";

import { authSchema } from "@/lib/validation-schema/auth";
import { parseWithZod } from "@conform-to/zod";
import { auth } from "../auth";

export async function registerUser(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: authSchema,
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

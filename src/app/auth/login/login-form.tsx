"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { loginSchema } from "@/lib/validation-schema/auth";
import { loginUser } from "@/server/services/auth-service";
import { FormInput } from "@/components/form/text-input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [lastResult, action] = useActionState(loginUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <FormInput
            label={"Email"}
            description={undefined}
            errors={fields.email.errors}
            required={true}
            inputProps={{
              id: fields.email.id,
              name: fields.email.name,
              type: "text",
            }}
          />
        </div>

        <div className="grid gap-3">
          <FormInput
            label={"Password"}
            description={"A strong password minimum 8 characters"}
            errors={fields.password.errors}
            required={true}
            inputProps={{
              id: fields.password.id,
              name: fields.password.name,
              type: "password",
            }}
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}

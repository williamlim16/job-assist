"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/text-input";
import { useActionState } from "react";
import { registerUser } from "@/server/services/auth-service";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { registerSchema } from "@/lib/validation-schema/auth";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [lastResult, action] = useActionState(registerUser, undefined);
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: registerSchema });
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
        <h1 className="text-2xl font-bold">Register your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to create your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <FormInput
            label={"Name"}
            description={"Name that will be displayed on your account"}
            errors={fields.name.errors}
            required={true}
            inputProps={{
              id: fields.name.id,
              name: fields.name.name,
              type: "text",
            }}
          />
        </div>
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
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </form>
  );
}

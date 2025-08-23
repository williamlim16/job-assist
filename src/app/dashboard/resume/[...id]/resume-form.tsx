"use client";

import { FormTextArea } from "@/components/form/text-area";
import { FormInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEditResumeSchema } from "@/lib/validation-schema/resume";
import type { SelectResume } from "@/server/db/schema";
import { createEditResume } from "@/server/services/resume-service";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useActionState, useState } from "react";

type Props = {
  resume: SelectResume | undefined;
};

export function ResumeForm({ resume }: Props) {
  const [lastResult, action] = useActionState(createEditResume, undefined);
  const [form, fields] = useForm({
    defaultValue: {
      id: resume?.id,
      content: resume?.content,
      title: resume?.title,
    },
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createEditResumeSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const [inputMethod, setInputMethod] = useState<"upload" | "manual">("manual");
  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      className="space-y-6"
      action={action}
      noValidate
    >
      <div>
        {form.errors?.map((error) => (
          <div className="text:red" key={error}>
            {error}
          </div>
        ))}
      </div>
      {/* Title Field */}
      <FormInput
        label="Title"
        description="Title for your resume"
        errors={fields.title.errors}
        required={true}
        inputProps={{
          defaultValue: fields.title.defaultValue,
          id: fields.title.id,
          name: fields.title.name,
          type: "text",
        }}
      />
      {/* Content Input */}
      {inputMethod === "manual" ? (
        <FormTextArea
          required={true}
          errors={fields.content.errors}
          label="Resume Content"
          description="The content of your resume"
          inputProps={{
            className: "min-h-[300px]",
            name: fields.content.name,
            id: fields.content.id,
            defaultValue: fields.content.defaultValue,
          }}
        />
      ) : (
        <div className="space-y-2">
          <Label htmlFor="file">
            Upload Cover Letter <span className="text-destructive">*</span>
          </Label>
        </div>
      )}

      {/*Extra details*/}
      {resume?.id && (
        <Input type="hidden" name={fields.id.name} value={fields.id.value} />
      )}

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="submit">Create resume</Button>
        <Link href="/dashboard/resume">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

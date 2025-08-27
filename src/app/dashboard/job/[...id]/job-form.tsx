"use client";

import { FormTextArea } from "@/components/form/text-area";
import { FormInput } from "@/components/form/text-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createEditJobSchema } from "@/lib/validation-schema/job";
import type { SelectJob } from "@/server/db/schema";
import { createEditJob } from "@/server/services/job-service";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Link from "next/link";
import { useActionState } from "react";

type Props = {
  job: SelectJob | undefined;
};

export function JobForm({ job }: Props) {
  const [lastResult, action] = useActionState(createEditJob, undefined);
  const [form, fields] = useForm({
    defaultValue: {
      id: job?.id,
      url: job?.url,
      description: job?.description,
      resumeId: job?.resumeId,
      title: job?.title,
    },
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createEditJobSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

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
        description="Title of the job"
        errors={fields.title.errors}
        required={true}
        inputProps={{
          defaultValue: fields.title.defaultValue,
          id: fields.title.id,
          name: fields.title.name,
          type: "text",
        }}
      />

      <FormInput
        label="Company Name"
        description="Name of the company"
        errors={fields.companyName.errors}
        required={false}
        inputProps={{
          defaultValue: fields.companyName.defaultValue,
          id: fields.companyName.id,
          name: fields.companyName.name,
          type: "text",
        }}
      />

      {/* Content Input */}
      <FormTextArea
        required={true}
        errors={fields.description.errors}
        label="Job description"
        description="The description of the job"
        inputProps={{
          className: "min-h-[300px]",
          name: fields.description.name,
          id: fields.description.id,
          defaultValue: fields.description.defaultValue,
        }}
      />

      {/*Extra details*/}
      {job?.id && (
        <Input type="hidden" name={fields.id.name} value={fields.id.value} />
      )}

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-4">
        <Button type="submit">Save</Button>
        <Link href="/dashboard/job">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}

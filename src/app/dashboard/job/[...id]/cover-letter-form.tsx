"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SelectJob, SelectResume } from "@/server/db/schema";
import {
  createEditJob,
  saveResumeReference,
} from "@/server/services/job-service";
import { FormTextArea } from "@/components/form/text-area";
import { useForm } from "@conform-to/react";
import { createEditJobSchema } from "@/lib/validation-schema/job";
import { parseWithZod } from "@conform-to/zod";
import { useActionState } from "react";
import { Input } from "@/components/ui/input";

type Props = {
  job: SelectJob | undefined;
  resumeList: SelectResume[] | undefined;
};

export default function CoverLetterForm({ job, resumeList }: Props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [id, setResumeId] = React.useState<number | undefined | null>(
    job?.resumeId,
  );

  const connectResume = React.useCallback(async () => {
    if (!job || !id) return;
    await saveResumeReference(id, job.id);
  }, [id, job]);

  const [lastResult, action] = useActionState(createEditJob, undefined);
  const [form, fields] = useForm({
    defaultValue: {
      id: job?.id,
      description: job?.description,
      title: job?.title,
      coverLetter: job?.coverLetter,
    },
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createEditJobSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <>
      <div className="flex gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {id && resumeList
                ? resumeList.find((resume) => resume.id === id)?.title
                : "Select resume.."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search framework..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  {resumeList?.map((resume) => (
                    <CommandItem
                      key={resume.id}
                      value={resume.title}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setResumeId(resume.id);
                        setOpen(false);
                      }}
                    >
                      {resume.title}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === resume.title ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button onClick={connectResume}>Use Resume</Button>

        <Button>Generate Cover Letter</Button>
      </div>

      {job?.resumeId && (
        <div>
          <form
            className="pt-4"
            id={form.id}
            action={action}
            onSubmit={form.onSubmit}
            noValidate
          >
            <FormTextArea
              description="Your cover letter based on resume"
              required={true}
              label={"Cover letter content"}
              errors={fields.coverLetter.errors}
              inputProps={{
                disabled: job.resumeId ? false : true,
                name: fields.coverLetter.name,
                defaultValue: fields.coverLetter.defaultValue,
                id: fields.coverLetter.id,
              }}
            />
            <Input type="hidden" name={fields.title.name} value={job?.title} />
            <Input type="hidden" name={fields.id.name} value={job?.id} />
            <Input
              type="hidden"
              name={fields.description.name}
              value={job?.description}
            />

            <Button type="submit">Save Cover Letter</Button>
          </form>
        </div>
      )}
    </>
  );
}

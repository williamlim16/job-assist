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
import { saveResumeReference } from "@/server/services/job-service";

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
      </div>
    </>
  );
}

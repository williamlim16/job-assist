"use client";

import type React from "react";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createResume } from "@/server/services/resume-service";
import { parseWithZod } from "@conform-to/zod";
import { createResumeSchema } from "@/lib/validation-schema/resume";
import { useForm } from "@conform-to/react";
import { FormTextArea } from "@/components/form/text-area";
import { FormInput } from "@/components/form/text-input";

export default function Page() {
  const [lastResult, action] = useActionState(createResume, undefined);
  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createResumeSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });
  const [inputMethod, setInputMethod] = useState<"upload" | "manual">("manual");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Read file content for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent(e.target?.result as string);
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/resume">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            Create New Resume
          </h1>
          <p className="text-muted-foreground">Add a new resume</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Details</CardTitle>
          <CardDescription>
            Provide a title and your resume content
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            {/* Input Method Selection */}
            {/* <div className="space-y-4"> */}
            {/*   <Label>How would you like to add your resume?</Label> */}
            {/*   <RadioGroup */}
            {/*     value={inputMethod} */}
            {/*     onValueChange={(value) => */}
            {/*       setInputMethod(value as "upload" | "manual") */}
            {/*     } */}
            {/*     className="grid grid-cols-2 gap-4" */}
            {/*   > */}
            {/*     <div className="flex items-center space-x-2 rounded-lg border p-4"> */}
            {/*       <RadioGroupItem value="manual" id="manual" /> */}
            {/*       <Label */}
            {/*         htmlFor="manual" */}
            {/*         className="flex cursor-pointer items-center gap-2" */}
            {/*       > */}
            {/*         <FileText className="h-4 w-4" /> */}
            {/*         Type manually */}
            {/*       </Label> */}
            {/*     </div> */}
            {/*     <div className="flex items-center space-x-2 rounded-lg border p-4"> */}
            {/*       <RadioGroupItem value="upload" id="upload" disabled={true} /> */}
            {/*       <Label */}
            {/*         htmlFor="upload" */}
            {/*         className="flex cursor-pointer items-center gap-2" */}
            {/*       > */}
            {/*         <Upload className="h-4 w-4" /> */}
            {/*         Upload file */}
            {/*       </Label> */}
            {/*     </div> */}
            {/*   </RadioGroup> */}
            {/* </div> */}

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
                  Upload Cover Letter{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <div className="rounded-lg border-2 border-dashed p-8 text-center">
                  <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                  <div className="space-y-2">
                    <p className="text-foreground">
                      {file ? file.name : "Choose a file or drag and drop"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Supports .txt, .doc, .docx files
                    </p>
                  </div>
                  <Input
                    id="file"
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileChange}
                    className="mt-4"
                    required
                  />
                </div>
                {content && (
                  <div className="mt-4 space-y-2">
                    <Label>Preview:</Label>
                    <div className="max-h-40 overflow-y-auto rounded-lg border p-4">
                      <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                        {content.substring(0, 500)}
                        {content.length > 500 && "..."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
        </CardContent>
      </Card>
    </div>
  );
}

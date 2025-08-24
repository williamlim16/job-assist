import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResumeForm } from "./resume-form";
import { getResumeById } from "@/server/services/resume-service";
import { headers } from "next/headers";

export default async function Page() {
  const headersList = await headers();
  const currentPathname = headersList.get("x-pathname");
  const resumeId = currentPathname?.split("/").pop();
  let resume = undefined;
  if (resumeId && parseInt(resumeId)) {
    resume = await getResumeById(Number(resumeId));
  }

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
            {resume?.id ? "Edit resume" : "Create new resume"}
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
          <ResumeForm resume={resume} />
        </CardContent>
      </Card>
    </div>
  );
}

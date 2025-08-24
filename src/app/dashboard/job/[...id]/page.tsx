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
import { headers } from "next/headers";
import { getJobById } from "@/server/services/job-service";
import { JobForm } from "./job-form";
import CoverLetterForm from "./cover-letter-form";
import { getResumeList } from "@/server/services/resume-service";

export default async function Page() {
  const headersList = await headers();
  const currentPathname = headersList.get("x-pathname");
  const jobId = currentPathname?.split("/").pop();
  let job = undefined;
  if (jobId && parseInt(jobId)) {
    job = await getJobById(Number(jobId));
  }

  const resumeList = await getResumeList();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/job">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-foreground text-3xl font-bold">
            {job?.id ? "Edit job" : "Create new job"}
          </h1>
          <p className="text-muted-foreground">Add a new job</p>
        </div>
      </div>
      {/* Job Form */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide a title and your job description
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobForm job={job} />
        </CardContent>
      </Card>

      {/* Cover letter generator*/}
      <Card>
        <CardHeader>
          <CardTitle>Cover letter</CardTitle>
          <CardDescription>
            Generate a tailored cover letter for your job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CoverLetterForm job={job} resumeList={resumeList} />
        </CardContent>
      </Card>
    </div>
  );
}

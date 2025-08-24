import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import JobTable from "./job-data-table";
import Link from "next/link";
import { getJobList } from "@/server/services/job-service";

export default async function Page() {
  const jobs = await getJobList();
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground mb-2 text-3xl font-bold">Job</h2>
            <p className="text-muted-foreground">
              Manage and track all your jobs
            </p>
          </div>
          <Link href={"/dashboard/job/add"}>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Job
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Job</CardTitle>
            <CardDescription>
              View, edit, and manage your jobs with match scores and application
              status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobTable job={jobs} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

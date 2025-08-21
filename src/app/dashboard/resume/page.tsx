import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import ResumeTable from "./resume-data-table";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground mb-2 text-3xl font-bold">Resume</h2>
            <p className="text-muted-foreground">
              Manage and track all your tailored cover letters
            </p>
          </div>
          <Link href={"/dashboard/resume/add"}>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              New Resume
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Resume</CardTitle>
            <CardDescription>
              View, edit, and manage your cover letters with match scores and
              application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResumeTable />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

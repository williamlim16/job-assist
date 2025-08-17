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

export default function Page() {
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground mb-2 text-3xl font-bold">
              Cover Letters
            </h2>
            <p className="text-muted-foreground">
              Manage and track all your tailored cover letters
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Cover Letter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Cover Letters</CardTitle>
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

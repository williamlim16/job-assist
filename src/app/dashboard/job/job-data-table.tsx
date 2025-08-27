"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit3, MoreHorizontal, Search, Trash } from "lucide-react";
import type { SelectJob } from "@/server/db/schema";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteJobById } from "@/server/services/job-service";
import { Badge } from "@/components/ui/badge";
import { B } from "node_modules/better-auth/dist/shared/better-auth.DnUZno9_";

type Props = {
  job: SelectJob[];
};

export default function JobTable({ job }: Props) {
  const ClientFormattedDate = ({ dateString }: { dateString: Date }) => {
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
      if (dateString) {
        setFormattedDate(new Date(dateString).toLocaleString());
      }
    }, [dateString]);

    return <span>{formattedDate}</span>;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<SelectJob | null>(null);

  const filteredData = job.filter((resume) => {
    const matchesSearch =
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleDeleteClick = (job: SelectJob) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) {
      return;
    }
    await deleteJobById(jobToDelete.id);
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  function toTitleCase(str: string) {
    return str.replace(
      /\w\S*/g,
      (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
    );
  }
  const StatusBadge = ({ status }: { status: SelectJob["status"] }) => {
    const normalizedStatus = status.toLowerCase();
    let colorClasses = "";

    // Determine the Tailwind classes based on the status.
    switch (normalizedStatus) {
      case "applied":
        colorClasses =
          "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
        break;
      case "lead":
        colorClasses =
          "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200";
        break;
      case "accepted":
        colorClasses =
          "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
        break;
      case "rejected":
        colorClasses =
          "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
        break;
      case "draft":
      default:
        colorClasses =
          "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
        break;
    }

    // Common styling classes for the badge.
    const baseClasses =
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    return (
      <Badge className={`${baseClasses} ${colorClasses}`}>
        {toTitleCase(status)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search companies or positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">{job.title}</TableCell>

                <TableCell className="font-medium">
                  <StatusBadge status={job.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.createdAt ? (
                    <ClientFormattedDate dateString={job.createdAt} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.updatedAt ? (
                    <ClientFormattedDate dateString={job.updatedAt} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/job/${job.id}`}>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuItem onClick={() => handleDeleteClick(job)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the job
              {jobToDelete?.title} and remove it from your data.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

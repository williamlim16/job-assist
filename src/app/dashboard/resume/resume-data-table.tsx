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
import {
  Eye,
  Edit3,
  Download,
  MoreHorizontal,
  Search,
  Trash,
} from "lucide-react";
import type { SelectResume } from "@/server/db/schema";
import Link from "next/link";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteResumeById } from "@/server/services/resume-service";

type Props = {
  resume: SelectResume[];
};

export default function ResumeTable({ resume }: Props) {
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

  const filteredData = resume.filter((resume) => {
    const matchesSearch =
      resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.content?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleDeleteClick = (resume: SelectResume) => {
    setResumeToDelete(resume);
    setDeleteDialogOpen(true);
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<SelectResume | null>(
    null,
  );

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) {
      return;
    }
    await deleteResumeById(resumeToDelete.id);
    setDeleteDialogOpen(false);
    setResumeToDelete(null);
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
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((resume) => (
              <TableRow key={resume.id}>
                <TableCell className="font-medium">{resume.title}</TableCell>
                <TableCell className="text-muted-foreground">
                  {resume.createdAt ? (
                    <ClientFormattedDate dateString={resume.createdAt} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {resume.updatedAt ? (
                    <ClientFormattedDate dateString={resume.updatedAt} />
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
                      <Link href={`/dashboard/resume/${resume.id}`}>
                        <DropdownMenuItem>
                          <Edit3 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(resume)}
                      >
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
              This action cannot be undone. This will permanently delete the
              resume
              {resumeToDelete?.title} and remove it from your data.
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

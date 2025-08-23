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
import { Eye, Edit3, Download, MoreHorizontal, Search } from "lucide-react";
import type { SelectResume } from "@/server/db/schema";
import Link from "next/link";

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
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

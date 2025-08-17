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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit3, Download, MoreHorizontal, Search } from "lucide-react";

const resumeData: {
  id: number;
  company: string;
  position: string;
  matchScore: number;
  dateCreated: Date;
  dateSent: Date | undefined | null;
  status: "Sent" | "Draft" | "Interview" | "Rejected";
}[] = [
  {
    id: 1,
    company: "TechCorp Inc.",
    position: "Senior Frontend Developer",
    status: "Sent",
    matchScore: 94,
    dateCreated: new Date("2024-01-15"),
    dateSent: new Date("2024-01-16"),
  },
  {
    id: 2,
    company: "StartupXYZ",
    position: "Full Stack Engineer",
    status: "Draft",
    matchScore: 87,
    dateCreated: new Date("2024-01-14"),
    dateSent: null,
  },
  {
    id: 3,
    company: "Enterprise Solutions",
    position: "React Developer",
    status: "Sent",
    matchScore: 91,
    dateCreated: new Date("2024-01-10"),
    dateSent: new Date("2024-01-11"),
  },
  {
    id: 4,
    company: "InnovateTech",
    position: "UI/UX Developer",
    status: "Interview",
    matchScore: 96,
    dateCreated: new Date("2024-01-08"),
    dateSent: new Date("2024-01-09"),
  },
  {
    id: 5,
    company: "DataFlow Corp",
    position: "Frontend Engineer",
    status: "Rejected",
    matchScore: 82,
    dateCreated: new Date("2024-01-05"),
    dateSent: new Date("2024-01-06"),
  },
];

export default function ResumeTable() {
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
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = resumeData.filter((resume) => {
    const matchesSearch =
      resume.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resume.position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      resume.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "default";
      case "draft":
        return "secondary";
      case "interview":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "secondary";
    }
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Status: {statusFilter === "all" ? "All" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
              Draft
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("sent")}>
              Sent
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("interview")}>
              Interview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
              Rejected
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Data Table */}
      <div className="border-border rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((resume) => (
              <TableRow key={resume.id}>
                <TableCell className="font-medium">{resume.company}</TableCell>
                <TableCell>{resume.position}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(resume.status)}>
                    {resume.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={resume.matchScore} className="h-2 w-16" />
                    <span className="text-sm font-medium">
                      {resume.matchScore}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {resume.dateCreated ? (
                    <ClientFormattedDate dateString={resume.dateCreated} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {resume.dateSent ? (
                    <ClientFormattedDate dateString={resume.dateSent} />
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
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
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

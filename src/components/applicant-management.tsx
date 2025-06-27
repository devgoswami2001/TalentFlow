
"use client";

import * as React from "react";
import {
  applicants as initialApplicants,
  jobs,
  type Applicant,
} from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ApplicantProfile } from "./applicant-profile";
import { format } from "date-fns";
import { Progress } from "./ui/progress";

const statusVariantMap: { [key in Applicant["status"]]: "default" | "secondary" | "outline" | "destructive" } = {
    Applied: 'outline',
    Shortlisted: 'secondary',
    Interview: 'default',
    Offer: 'default',
    Hired: 'default',
    Rejected: 'destructive'
};

export function ApplicantManagement() {
  const [applicants, setApplicants] = React.useState<Applicant[]>(initialApplicants);
  const [filteredApplicants, setFilteredApplicants] = React.useState<Applicant[]>(initialApplicants);
  const [selectedJob, setSelectedJob] = React.useState("all");
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);

  React.useEffect(() => {
    if (selectedJob === "all") {
      setFilteredApplicants(applicants);
    } else {
      setFilteredApplicants(
        applicants.filter((applicant) => applicant.jobId === parseInt(selectedJob))
      );
    }
  }, [selectedJob, applicants]);

  const handleStatusChange = (applicantId: number, newStatus: Applicant["status"]) => {
    setApplicants(prevApplicants =>
        prevApplicants.map(applicant =>
            applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
        )
    );
    if (selectedApplicant?.id === applicantId) {
        setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSelectApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
  };
  
  const getJobDescription = (jobId: number): string => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.description : "";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Select value={selectedJob} onValueChange={setSelectedJob}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Filter by job..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Jobs</SelectItem>
            {jobs.map((job) => (
              <SelectItem key={job.id} value={String(job.id)}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Applied For</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Skills Match</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.map((applicant) => (
              <TableRow key={applicant.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint="person portrait" />
                      <AvatarFallback>
                        {applicant.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {applicant.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{applicant.jobTitle}</TableCell>
                <TableCell>{format(new Date(applicant.appliedDate), "PPP")}</TableCell>
                <TableCell>
                  <Badge variant={statusVariantMap[applicant.status]}>{applicant.status}</Badge>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        {applicant.matchPercentage ? (
                            <>
                                <Progress value={applicant.matchPercentage} className="w-24 h-2" />
                                <span className="text-sm font-medium">{applicant.matchPercentage}%</span>
                            </>
                        ) : (
                            <span className="text-muted-foreground text-sm">N/A</span>
                        )}
                    </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectApplicant(applicant)}
                  >
                    View Profile
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Sheet open={!!selectedApplicant} onOpenChange={(isOpen) => !isOpen && setSelectedApplicant(null)}>
        <SheetContent className="w-full sm:w-3/4 lg:w-1/2 sm:max-w-none flex flex-col">
            {selectedApplicant && (
                <ApplicantProfile 
                    applicant={selectedApplicant} 
                    jobDescription={getJobDescription(selectedApplicant.jobId)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

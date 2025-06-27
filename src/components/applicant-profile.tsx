
"use client";

import * as React from "react";
import {
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Applicant } from "@/lib/data";
import { getAnalysisForApplicant } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertTriangle } from "lucide-react";

type ApplicantProfileProps = {
  applicant: Applicant;
  jobDescription: string;
  onStatusChange: (applicantId: number, newStatus: Applicant["status"]) => void;
};

const statusOptions: Applicant["status"][] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export function ApplicantProfile({
  applicant,
  jobDescription,
  onStatusChange,
}: ApplicantProfileProps) {
  const [analysis, setAnalysis] = React.useState<{
    highlightedResume: string;
    skillsMatchPercentage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (applicant && jobDescription) {
      setIsLoading(true);
      setError(null);
      setAnalysis(null);

      getAnalysisForApplicant(applicant.resumeText, jobDescription)
        .then((result) => {
          setAnalysis(result);
        })
        .catch((err) => {
          setError(err.message || "An unknown error occurred.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [applicant, jobDescription]);

  return (
    <>
      <SheetHeader className="text-left flex-row gap-4 items-center space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint="person portrait"/>
          <AvatarFallback className="text-2xl">
            {applicant.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <SheetTitle className="text-2xl font-headline">{applicant.name}</SheetTitle>
          <SheetDescription className="text-base">
            {applicant.email} &middot; {applicant.phone}
          </SheetDescription>
          <div className="mt-2">
            <Badge variant="secondary">{applicant.jobTitle}</Badge>
          </div>
        </div>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto pr-6 -mr-6 space-y-6 py-6">
        <div className="space-y-4 rounded-lg border p-4">
            <h3 className="font-semibold font-headline">Candidate Status</h3>
            <div className="grid gap-2">
                <Label htmlFor="status-select">Update Status</Label>
                <Select
                    value={applicant.status}
                    onValueChange={(newStatus: Applicant["status"]) => onStatusChange(applicant.id, newStatus)}
                >
                    <SelectTrigger id="status-select">
                        <SelectValue placeholder="Change status..." />
                    </SelectTrigger>
                    <SelectContent>
                        {statusOptions.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="font-semibold font-headline">AI Analysis</h3>
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : analysis && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <Label>Skills Match</Label>
                  <span className="text-2xl font-bold font-headline text-primary">
                    {analysis.skillsMatchPercentage}%
                  </span>
                </div>
                <Progress value={analysis.skillsMatchPercentage} />
              </div>
              <div className="space-y-2">
                <Label>Highlighted Resume</Label>
                <div
                  className="prose prose-sm dark:prose-invert max-h-[500px] overflow-y-auto rounded-md border p-4 whitespace-pre-wrap bg-muted/50"
                  dangerouslySetInnerHTML={{ __html: analysis.highlightedResume }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

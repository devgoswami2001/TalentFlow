
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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import type { Applicant } from "@/lib/data";
import { getAnalysisForApplicant } from "@/lib/actions";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { AlertTriangle, Briefcase, Mail, Phone, Printer, UserCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { formatDistanceToNow } from "date-fns";

type ApplicantProfileProps = {
  applicant: Applicant;
  jobDescription: string;
  onStatusChange: (applicantId: number, newStatus: Applicant["status"]) => void;
  onNoteAdd: (applicantId: number, noteContent: string) => void;
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
  onNoteAdd,
}: ApplicantProfileProps) {
  const [analysis, setAnalysis] = React.useState<{
    highlightedResume: string;
    skillsMatchPercentage: number;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [newNote, setNewNote] = React.useState("");

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

  const handlePrint = () => {
    if (analysis?.highlightedResume) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${applicant.name} - Resume</title>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Space+Grotesk:wght@700&display=swap');
                            body { font-family: 'Inter', sans-serif; line-height: 1.6; padding: 2rem; color: #111827; }
                            h1, h2 { font-family: 'Space Grotesk', sans-serif; }
                            h1 { font-size: 2.25rem; }
                            hr { border-color: #e5e7eb; margin: 1rem 0; }
                            mark { background-color: #f1e5f9; color: #A06CD5; padding: 2px 4px; border-radius: 4px; font-weight: 500;}
                            .resume-content { white-space: pre-wrap; font-family: inherit; font-size: 14px; background-color: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #e5e7eb;}
                            @page { size: A4; margin: 1in; }
                        </style>
                    </head>
                    <body>
                        <h1>${applicant.name}</h1>
                        <p>${applicant.email} &middot; ${applicant.phone}</p>
                        <hr />
                        <div class="resume-content">${analysis.highlightedResume.replace(/<mark/g, '<mark style="background-color: #f1e5f9; color: #A06CD5; padding: 2px 4px; border-radius: 4px; font-weight: 500;"')}</div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
        onNoteAdd(applicant.id, newNote.trim());
        setNewNote("");
    }
  }

  return (
    <>
      <SheetHeader className="text-left flex-row gap-4 items-center space-y-0 p-6 pb-0">
        <Avatar className="h-20 w-20 border">
          <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint="person portrait"/>
          <AvatarFallback className="text-3xl">
            {applicant.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <SheetTitle className="text-2xl font-headline">{applicant.name}</SheetTitle>
          <SheetDescription className="text-base flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {applicant.email}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {applicant.phone}</span>
          </SheetDescription>
          <div className="pt-1">
            <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                <Briefcase className="h-3 w-3" /> 
                Applied for {applicant.jobTitle}
            </Badge>
          </div>
        </div>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto -mr-6 pr-6">
        <Tabs defaultValue="analysis" className="mt-4">
            <div className="px-6">
                 <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="analysis" className="space-y-6 p-6">
                <h3 className="font-semibold font-headline text-lg">AI Analysis</h3>
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
                    <div className="space-y-6">
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
            </TabsContent>
            <TabsContent value="notes" className="space-y-6 p-6">
                <h3 className="font-semibold font-headline text-lg">Internal Notes</h3>
                <div className="space-y-4">
                    <div className="grid gap-4">
                        <Textarea 
                            placeholder="Add a note about this candidate..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="min-h-[80px]"
                        />
                        <Button onClick={handleAddNote} disabled={!newNote.trim()} className="w-fit">
                            Add Note
                        </Button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                        {applicant.notes && applicant.notes.length > 0 ? (
                            applicant.notes.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(note => (
                                <div key={note.id} className="text-sm border-l-2 pl-4 py-2">
                                    <p className="whitespace-pre-wrap">{note.content}</p>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        <strong>{note.author}</strong> &middot; {formatDistanceToNow(new Date(note.timestamp), { addSuffix: true })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg">
                                <MessageSquare className="w-12 h-12 text-muted-foreground mb-2" />
                                <h4 className="text-base font-semibold">No Notes Yet</h4>
                                <p className="text-muted-foreground text-sm">Be the first to add a note.</p>
                            </div>
                        )}
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="actions" className="space-y-6 p-6">
                <h3 className="font-semibold font-headline text-lg">Candidate Management</h3>
                <div className="space-y-4 rounded-lg border p-4">
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
                <div className="space-y-4 rounded-lg border p-4">
                    <Label>More Options</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                         <Button variant="outline" className="w-full justify-center" asChild>
                           <Link href={`/dashboard/applicants/${applicant.id}`} target="_blank">
                                <UserCircle /> View Full Profile
                           </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-center" onClick={handlePrint} disabled={!analysis || isLoading}>
                            <Printer /> Print Resume
                        </Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

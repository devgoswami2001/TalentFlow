

"use client";

import * as React from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { 
    AlertTriangle, Briefcase, Calendar, Mail, MessageSquare, Phone, Printer, Sparkles, FileText
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import type { Applicant, Job } from "@/lib/data";

type ApplicantProfilePageProps = {
  applicant: Applicant;
  job: Job;
  analysis: {
    highlightedResume: string;
    skillsMatchPercentage: number;
  } | null;
  analysisError: string | null;
};

const statusOptions: Applicant['status'][] = [
  "applied",
  "shortlisted",
  "interview",
  "offer",
  "hired",
  "rejected",
];

const statusVariantMap: { [key in Applicant["status"]]: "default" | "secondary" | "outline" | "destructive" } = {
    applied: 'outline',
    shortlisted: 'secondary',
    interview: 'default',
    offer: 'default',
    hired: 'default',
    rejected: 'destructive'
};

export function ApplicantProfilePage({ applicant: initialApplicant, job, analysis, analysisError }: ApplicantProfilePageProps) {
  const [applicant, setApplicant] = React.useState(initialApplicant);
  const [newNote, setNewNote] = React.useState("");

  // This is a mock update. In a real app, you'd likely call an API and update a central store.
  const handleStatusChange = (newStatus: Applicant["status"]) => {
    setApplicant(prev => ({ ...prev, status: newStatus }));
    // Here you would also update the global state or database
  };

  const handleNoteAdd = () => {
    if (newNote.trim()) {
      console.log("Adding note:", newNote);
      setNewNote("");
    }
  };

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
                        <p>${applicant.email}</p>
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Left Column */}
      <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-20">
        <Card>
          <CardHeader className="items-center text-center">
            
            <CardTitle className="font-headline text-2xl">{applicant.name}</CardTitle>
            <Badge variant={statusVariantMap[applicant.status]}>{applicant.status}</Badge>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${applicant.email}`} className="hover:text-primary break-all">{applicant.email}</a>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{applicant.applicant_profile.phone_number}</span>
                </div>
                 <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Applied {format(new Date(applicant.appliedDate), "PPP")}</span>
                </div>
            </div>
             <Separator />
             <div className="space-y-2">
                <h4 className="font-semibold">Applied for</h4>
                <div className="flex items-start gap-3">
                    <Briefcase className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
                    <span className="font-medium">{applicant.jobTitle}</span>
                </div>
             </div>
             {analysis && (
                 <>
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <h4 className="font-semibold">Skills Match</h4>
                            <span className="font-bold text-lg font-headline text-primary">{analysis.skillsMatchPercentage}%</span>
                        </div>
                        <Progress value={analysis.skillsMatchPercentage} />
                    </div>
                 </>
             )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Update Status</label>
                    <Select value={applicant.status} onValueChange={handleStatusChange}>
                        <SelectTrigger><SelectValue placeholder="Change status..." /></SelectTrigger>
                        <SelectContent>
                            {statusOptions.map(status => (
                                <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" className="w-full justify-center" onClick={handlePrint} disabled={!analysis}>
                    <Printer className="mr-2 h-4 w-4" /> Print Analyzed Resume
                </Button>
            </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-3 space-y-6">
         <Tabs defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analysis"><Sparkles className="mr-2 h-4 w-4" /> AI Analysis</TabsTrigger>
            <TabsTrigger value="resume"><FileText className="mr-2 h-4 w-4" /> Full Resume</TabsTrigger>
            <TabsTrigger value="notes"><MessageSquare className="mr-2 h-4 w-4" /> Notes</TabsTrigger>
            <TabsTrigger value="job"><Briefcase className="mr-2 h-4 w-4" /> Job Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Resume Analysis</CardTitle>
                    <CardDescription>AI-highlighted skills based on the job description.</CardDescription>
                </CardHeader>
                <CardContent>
                    {analysisError ? (
                         <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Analysis Failed</AlertTitle>
                            <AlertDescription>{analysisError}</AlertDescription>
                        </Alert>
                    ) : analysis ? (
                        <div
                            className="prose prose-sm dark:prose-invert max-h-[600px] overflow-y-auto rounded-md border p-4 whitespace-pre-wrap bg-muted/50"
                            dangerouslySetInnerHTML={{ __html: analysis.highlightedResume }}
                        />
                    ) : (
                        <div className="flex items-center justify-center p-8 text-muted-foreground">
                            <Sparkles className="mr-2 h-4 w-4 animate-pulse" /> Loading analysis...
                        </div>
                    )}
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Original Resume</CardTitle>
                    <CardDescription>The candidate's full, unedited resume, formatted for readability.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-h-[600px] overflow-y-auto rounded-md border p-6 bg-muted/50 space-y-6">
                        {applicant.resumeText.split('---').map((section, index) => {
                            if (section.trim() === '') return null;
                            
                            const lines = section.trim().split('\n').map(l => l.trim()).filter(Boolean);
                            
                            if (index === 0) { // Header section
                                return (
                                    <div key={index} className="text-center pb-4 border-b">
                                        <h2 className="text-2xl font-bold font-headline">{lines[0]}</h2>
                                        {lines.slice(1).map((line, subIndex) => (
                                            <p key={subIndex} className="text-muted-foreground">{line}</p>
                                        ))}
                                    </div>
                                )
                            }

                            const title = lines.shift() || 'Section';
                            return (
                                <div key={index}>
                                    <h3 className="text-xl font-semibold font-headline mb-3 text-primary">{title}</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        {lines.map((line, lineIndex) => (
                                            <li key={lineIndex} className="text-muted-foreground leading-relaxed">{line.replace(/^- /, '')}</li>
                                        ))}
                                    </ul>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                    <CardDescription>Collaborate with your team by leaving notes on the candidate.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4">
                        <Textarea 
                            placeholder="Add a note..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <Button onClick={handleNoteAdd} disabled={!newNote.trim()} className="w-fit">
                            Add Note
                        </Button>
                    </div>
                    <Separator />
                    <div className="space-y-4">
                        
                            <div className="text-center p-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                <MessageSquare className="mx-auto h-8 w-8 mb-2" />
                                No notes yet.
                            </div>
                        
                    </div>
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="job" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>Full job description for the role the candidate applied for.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap p-4 bg-muted/30 rounded-lg">
                        {job.description}
                    </div>
                    <Separator className="my-6" />
                    <h4 className="font-semibold mb-4 text-base">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                    </div>

                    {job.screeningQuestions && job.screeningQuestions.length > 0 && (
                        <>
                            <Separator className="my-6" />
                            <h4 className="font-semibold mb-4 text-base">Screening Questions</h4>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                {job.screeningQuestions.map((q, i) => <li key={i}>{q.question}</li>)}
                            </ul>
                        </>
                    )}
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
}

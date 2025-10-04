

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
import type { Applicant, Note, ApplicantStatus } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { AlertTriangle, Briefcase, Mail, Phone, Printer, UserCircle, MessageSquare, CheckCircle, Star, ThumbsUp, ThumbsDown, XCircle, Lightbulb, Trash2, Send, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { getApplicantNotes, addApplicantNote, deleteApplicantNote } from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

type ApplicantProfileProps = {
  applicant: Applicant;
  jobDescription: string;
  onStatusChange: (applicantId: number, newStatus: ApplicantStatus) => void;
};

const statusOptions: ApplicantStatus[] = [
    'applied',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'offer_made',
    'hired',
    'rejected',
];

const highlightSkills = (resumeText: string, skills: string[]) => {
  if (!skills || skills.length === 0) {
    return resumeText;
  }
  const regex = new RegExp(`\\b(${skills.join('|')})\\b`, 'gi');
  return resumeText.replace(regex, '<mark>$&</mark>');
};


export function ApplicantProfile({
  applicant,
  jobDescription,
  onStatusChange,
}: ApplicantProfileProps) {
  const { toast } = useToast();
  const [newNote, setNewNote] = React.useState("");
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [isNotesLoading, setIsNotesLoading] = React.useState(false);
  const [isNoteSubmitting, setIsNoteSubmitting] = React.useState(false);

  const analysis = React.useMemo(() => {
    if (!applicant || !applicant.ai_remarks) {
      return null;
    }
    return {
      ...applicant.ai_remarks,
      skillsMatchPercentage: parseFloat(applicant.ai_remarks.fit_score) || 0,
      highlightedResume: highlightSkills(applicant.resumeText, applicant.ai_remarks.matching_skills || []),
    };
  }, [applicant]);

  const handleFetchNotes = React.useCallback(async () => {
    setIsNotesLoading(true);
    const result = await getApplicantNotes(applicant.id);
    if (result.success && result.data) {
        setNotes(result.data);
    } else {
        toast({
            variant: "destructive",
            title: "Failed to load notes",
            description: result.error,
        });
    }
    setIsNotesLoading(false);
  }, [applicant.id, toast]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setIsNoteSubmitting(true);
    const result = await addApplicantNote(applicant.id, newNote.trim());
    if (result.success && result.data) {
        setNotes(prev => [result.data!, ...prev]);
        setNewNote("");
        toast({ title: "Note Added", description: "Your note has been saved." });
    } else {
        toast({
            variant: "destructive",
            title: "Failed to add note",
            description: result.error,
        });
    }
    setIsNoteSubmitting(false);
  };

  const handleDeleteNote = async (remarkId: number) => {
    const result = await deleteApplicantNote(remarkId);
    if (result.success) {
        setNotes(prev => prev.filter(note => note.id !== remarkId));
        toast({ title: "Note Deleted", description: "The note has been removed." });
    } else {
        toast({
            variant: "destructive",
            title: "Failed to delete note",
            description: result.error,
        });
    }
  }

  
  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
        case 'highly recommended':
            return <Badge variant="default" className="bg-green-600 hover:bg-green-700"><CheckCircle className="mr-2 h-4 w-4" />{recommendation}</Badge>;
        case 'recommended':
            return <Badge variant="secondary"><Star className="mr-2 h-4 w-4" />{recommendation}</Badge>;
        default:
            return <Badge variant="outline">{recommendation}</Badge>;
    }
  }

  return (
    <>
      <SheetHeader className="text-left flex-row gap-4 items-center space-y-0 p-6 pb-0">
        
        <div className="space-y-1">
          <SheetTitle className="text-2xl font-headline">{applicant.applicant_profile.full_name}</SheetTitle>
          <SheetDescription className="text-base flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-1">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> {applicant.applicant_profile.email}</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> {applicant.applicant_profile.phone_number}</span>
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
                    <TabsTrigger value="notes" onClick={handleFetchNotes}>Notes</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="analysis" className="space-y-6 p-6">
                {!analysis ? (
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Analysis Not Available</AlertTitle>
                        <AlertDescription>AI remarks for this applicant could not be loaded.</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Overall Recommendation</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {getRecommendationBadge(analysis.overall_recommendation)}
                                <p className="text-sm text-muted-foreground">{analysis.remarks}</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg">Detailed Scores</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline text-sm">
                                        <Label>Fit Score</Label>
                                        <span className="font-bold">{analysis.fit_score}%</span>
                                    </div>
                                    <Progress value={parseFloat(analysis.fit_score)} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline text-sm">
                                        <Label>Skills Match</Label>
                                        <span className="font-bold">{analysis.skills_match_score}%</span>
                                    </div>
                                    <Progress value={parseFloat(analysis.skills_match_score)} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline text-sm">
                                        <Label>Experience Match</Label>
                                        <span className="font-bold">{analysis.experience_match_score}%</span>
                                    </div>
                                    <Progress value={parseFloat(analysis.experience_match_score)} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-baseline text-sm">
                                        <Label>Education Match</Label>
                                        <span className="font-bold">{analysis.education_match_score}%</span>
                                    </div>
                                    <Progress value={parseFloat(analysis.education_match_score)} />
                                </div>
                            </CardContent>
                        </Card>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold flex items-center"><ThumbsUp className="mr-2 h-4 w-4 text-green-500"/>Strengths</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {analysis.strengths.map((skill, i) => <Badge key={`str-${i}`} variant="secondary">{skill}</Badge>)}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold flex items-center"><ThumbsDown className="mr-2 h-4 w-4 text-amber-500"/>Weaknesses</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                     {analysis.weaknesses.length > 0 ?
                                        analysis.weaknesses.map((skill, i) => <Badge key={`weak-${i}`} variant="outline">{skill}</Badge>)
                                        : <p className="text-sm text-muted-foreground">No weaknesses identified.</p>
                                     }
                                </CardContent>
                            </Card>
                        </div>
                        
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold flex items-center"><CheckCircle className="mr-2 h-4 w-4 text-blue-500"/>Matching Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {analysis.matching_skills.map((skill, i) => <Badge key={`match-${i}`} variant="default">{skill}</Badge>)}
                                </CardContent>
                            </Card>
                             <Card>
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold flex items-center"><XCircle className="mr-2 h-4 w-4 text-red-500"/>Missing Skills</CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                     {analysis.missing_skills.length > 0 ?
                                        analysis.missing_skills.map((skill, i) => <Badge key={`miss-${i}`} variant="destructive">{skill}</Badge>)
                                        : <p className="text-sm text-muted-foreground">No missing skills identified.</p>
                                     }
                                </CardContent>
                            </Card>
                        </div>

                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-lg flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-yellow-400"/>AI Recommendations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                                    {analysis.recommendations.map((rec, i) => <li key={`rec-${i}`}>{rec}</li>)}
                                </ul>
                            </CardContent>
                        </Card>

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
                    <div className="grid gap-2">
                        <Textarea 
                            placeholder="Add a note about this candidate..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="min-h-[80px]"
                            disabled={isNoteSubmitting}
                        />
                        <Button onClick={handleAddNote} disabled={!newNote.trim() || isNoteSubmitting} className="w-fit">
                            {isNoteSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {isNoteSubmitting ? 'Adding...' : 'Add Note'}
                        </Button>
                    </div>
                     <Separator />
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                         {isNotesLoading ? (
                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading notes...
                            </div>
                        ) : notes.length > 0 ? (
                           notes.map(note => (
                             <Card key={note.id} className="bg-muted/50 relative group">
                                 <CardContent className="p-4 text-sm">
                                     <div className="flex justify-between items-start">
                                         <div>
                                            <p className="font-semibold">{note.reviewer_name}</p>
                                            <p className="text-xs text-muted-foreground">{note.reviewer_email}</p>
                                         </div>
                                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}</p>
                                     </div>
                                      <p className="mt-3 whitespace-pre-wrap">{note.remark}</p>
                                 </CardContent>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-4 h-4"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete this note.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteNote(note.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                             </Card>
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
                            onValueChange={(newStatus: ApplicantStatus) => onStatusChange(applicant.id, newStatus)}
                        >
                            <SelectTrigger id="status-select">
                                <SelectValue placeholder="Change status..." />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map(status => (
                                    <SelectItem key={status} value={status}>{status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-4 rounded-lg border p-4">
                    <Label>More Options</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                         <Button variant="outline" className="w-full justify-center" asChild>
                           <Link href={`/dashboard/applicants/${applicant.id}/report`} target="_blank">
                                <FileText className="mr-2 h-4 w-4" /> View Full Report
                           </Link>
                        </Button>
                    </div>
                </div>
            </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

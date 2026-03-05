
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
import type { Applicant, Note, ApplicantStatus, ChatMessage } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { AlertTriangle, Briefcase, Mail, Phone, Printer, UserCircle, MessageSquare, CheckCircle, Star, ThumbsUp, ThumbsDown, XCircle, Lightbulb, Trash2, Send, Loader2, FileText, MessageCircle, Paperclip, X, Download } from "lucide-react";
import Link from "next/link";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { getApplicantNotes, addApplicantNote, deleteApplicantNote, getChatMessages, sendChatMessage } from "@/lib/actions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";

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

  // Chat states
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const [isMessageSubmitting, setIsMessageSubmitting] = React.useState(false);
  const [chatMessage, setChatMessage] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

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

  const handleFetchMessages = React.useCallback(async () => {
    setIsChatLoading(true);
    const result = await getChatMessages(applicant.id);
    if (result.success && result.data) {
        setMessages(result.data);
    } else {
        toast({
            variant: "destructive",
            title: "Failed to load chat",
            description: result.error,
        });
    }
    setIsChatLoading(false);
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

  const handleSendMessage = async () => {
    if (!chatMessage.trim() && !selectedFile) return;
    setIsMessageSubmitting(true);
    
    const formData = new FormData();
    formData.append("content", chatMessage.trim());
    if (selectedFile) {
        formData.append("file", selectedFile);
    }

    const result = await sendChatMessage(applicant.id, formData);
    if (result.success && result.data) {
        setMessages(prev => [...prev, result.data!]);
        setChatMessage("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
        toast({
            variant: "destructive",
            title: "Failed to send message",
            description: result.error,
        });
    }
    setIsMessageSubmitting(false);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Scroll to bottom of chat when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  
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
        <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={applicant.avatar} alt={applicant.applicant_profile.full_name} data-ai-hint="person portrait" />
            <AvatarFallback>{applicant.applicant_profile.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
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
        <Tabs defaultValue="analysis" className="mt-4 h-full flex flex-col">
            <div className="px-6">
                 <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                    <TabsTrigger value="notes" onClick={handleFetchNotes}>Notes</TabsTrigger>
                    <TabsTrigger value="chat" onClick={handleFetchMessages}>Chat</TabsTrigger>
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
            
            <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 p-0 overflow-hidden">
                <div className="flex flex-col h-full bg-muted/10">
                    <div className="p-4 border-b bg-background/50 backdrop-blur-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="h-5 w-5 text-primary" />
                            <h3 className="font-semibold font-headline">Chat with {applicant.applicant_profile.first_name}</h3>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleFetchMessages} disabled={isChatLoading}>
                            <Loader2 className={cn("h-4 w-4", isChatLoading && "animate-spin")} />
                        </Button>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-4">
                            {isChatLoading ? (
                                <div className="space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className={cn("flex gap-3", i % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
                                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                                            <Skeleton className="h-16 w-2/3 rounded-lg" />
                                        </div>
                                    ))}
                                </div>
                            ) : messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={cn(
                                            "flex flex-col max-w-[80%]",
                                            msg.sender_role === 'employer' ? "ml-auto items-end" : "mr-auto items-start"
                                        )}
                                    >
                                        <div className={cn(
                                            "rounded-2xl px-4 py-2 text-sm shadow-sm",
                                            msg.sender_role === 'employer' 
                                                ? "bg-primary text-primary-foreground rounded-tr-none" 
                                                : "bg-muted rounded-tl-none"
                                        )}>
                                            {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                                            {msg.file_url && (
                                                <div className={cn("flex items-center gap-2 mt-2 p-2 rounded-md", msg.sender_role === 'employer' ? "bg-primary-foreground/10" : "bg-background/50")}>
                                                    <FileText className="h-4 w-4 shrink-0" />
                                                    <span className="text-xs truncate max-w-[150px]">{msg.file_name || 'Attachment'}</span>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" asChild>
                                                        <a href={msg.file_url} target="_blank" rel="noopener noreferrer" download>
                                                            <Download className="h-3 w-3" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                            {format(new Date(msg.created_at), "p")}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center p-10 h-[300px]">
                                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                                        <MessageSquare className="h-8 w-8 text-primary" />
                                    </div>
                                    <h4 className="font-semibold">Start a Conversation</h4>
                                    <p className="text-sm text-muted-foreground max-w-[200px]">
                                        Send a message to the candidate to discuss the role or schedule an interview.
                                    </p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t bg-background">
                        {selectedFile && (
                            <div className="flex items-center gap-2 mb-3 p-2 bg-muted rounded-md text-sm">
                                <Paperclip className="h-4 w-4 text-primary" />
                                <span className="flex-1 truncate">{selectedFile.name}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeSelectedFile}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <input
                                type="file"
                                className="hidden"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="shrink-0 h-[44px] w-[44px]"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isMessageSubmitting}
                            >
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Textarea 
                                placeholder="Type a message..."
                                value={chatMessage}
                                onChange={(e) => setChatMessage(e.target.value)}
                                className="min-h-[44px] max-h-[120px] resize-none"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                            <Button 
                                size="icon" 
                                onClick={handleSendMessage} 
                                disabled={(!chatMessage.trim() && !selectedFile) || isMessageSubmitting}
                                className="shrink-0 h-[44px] w-[44px]"
                            >
                                {isMessageSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 text-center">
                            Press Enter to send, Shift + Enter for new line.
                        </p>
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

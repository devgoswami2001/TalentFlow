
"use client";

import * as React from "react";
import {
  applicants as initialApplicants,
  jobs,
  type Applicant,
  type Note
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Download, MessageSquare, XCircle, CheckCircle2 } from "lucide-react";


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
  const [selectedLocation, setSelectedLocation] = React.useState("all");
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = React.useState<number[]>([]);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = React.useState(false);
  const [bulkMessage, setBulkMessage] = React.useState("");
  const { toast } = useToast();

  const jobLocationMap = React.useMemo(() => new Map(jobs.map(j => [j.id, j.location])), []);

  React.useEffect(() => {
    let newFilteredApplicants = applicants;

    if (selectedJob !== "all") {
      newFilteredApplicants = newFilteredApplicants.filter(
        (applicant) => applicant.jobId === parseInt(selectedJob)
      );
    }
    
    if (selectedLocation !== "all") {
        newFilteredApplicants = newFilteredApplicants.filter(
            (applicant) => jobLocationMap.get(applicant.jobId) === selectedLocation
        );
    }

    setFilteredApplicants(newFilteredApplicants);
    setSelectedApplicantIds([]);
  }, [selectedJob, selectedLocation, applicants, jobLocationMap]);

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

  const handleNoteAdd = (applicantId: number, noteContent: string) => {
    const newNote: Note = {
      id: Date.now(),
      author: "Admin User", // In a real app, this would be the logged-in user
      content: noteContent,
      timestamp: new Date().toISOString(),
    };

    const updatedApplicants = applicants.map(applicant => {
      if (applicant.id === applicantId) {
        const updatedNotes = applicant.notes ? [...applicant.notes, newNote] : [newNote];
        return { ...applicant, notes: updatedNotes };
      }
      return applicant;
    });

    setApplicants(updatedApplicants);

    if (selectedApplicant?.id === applicantId) {
      setSelectedApplicant(prev => {
        if (!prev) return null;
        const updatedNotes = prev.notes ? [...prev.notes, newNote] : [newNote];
        return { ...prev, notes: updatedNotes };
      });
    }
  };


  const handleSelectApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
  };
  
  const getJobDescription = (jobId: number): string => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.description : "";
  }

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    setSelectedApplicantIds(checked ? filteredApplicants.map((a) => a.id) : []);
  };

  const handleSelectOne = (applicantId: number, checked: boolean) => {
    setSelectedApplicantIds((prev) =>
      checked ? [...prev, applicantId] : prev.filter((id) => id !== applicantId)
    );
  };

  const handleBulkStatusChange = (newStatus: Applicant["status"]) => {
    setApplicants(prevApplicants =>
        prevApplicants.map(applicant =>
            selectedApplicantIds.includes(applicant.id) ? { ...applicant, status: newStatus } : applicant
        )
    );
    toast({
        title: "Bulk Update Successful",
        description: `${selectedApplicantIds.length} applicants have been updated to "${newStatus}".`,
    });
    setSelectedApplicantIds([]);
  };

  const handleExport = () => {
    const selected = applicants.filter(a => selectedApplicantIds.includes(a.id));
    const headers = ["ID", "Name", "Email", "Job Title", "Status", "Applied On", "Resume Text"];
    const csvContent = [
        headers.join(','),
        ...selected.map(a => [
            a.id,
            `"${a.name.replace(/"/g, '""')}"`,
            a.email,
            `"${a.jobTitle.replace(/"/g, '""')}"`,
            a.status,
            a.appliedDate,
            `"${a.resumeText.replace(/"/g, '""')}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `applicants_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
        title: "Export Successful",
        description: `Data for ${selected.length} applicants has been exported.`,
    });
    setSelectedApplicantIds([]);
  };

  const handleSendBulkMessage = () => {
      console.log(`Sending message to ${selectedApplicantIds.length} applicants: ${bulkMessage}`);
      toast({
          title: "Message Sent (Simulated)",
          description: `Your message has been sent to ${selectedApplicantIds.length} applicants.`,
      });
      setIsMessageDialogOpen(false);
      setBulkMessage("");
      setSelectedApplicantIds([]);
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
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by location..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="On-site">On-site</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
        {selectedApplicantIds.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{selectedApplicantIds.length} of {filteredApplicants.length} selected</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onSelect={() => handleBulkStatusChange('Shortlisted')}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Shortlist
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleBulkStatusChange('Rejected')} className="text-destructive focus:text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsMessageDialogOpen(true)}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export List (.csv)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                 <Checkbox
                    checked={
                      selectedApplicantIds.length === filteredApplicants.length &&
                      filteredApplicants.length > 0
                    }
                    onCheckedChange={(checked) => handleSelectAll(checked)}
                    aria-label="Select all"
                  />
              </TableHead>
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
              <TableRow key={applicant.id} data-state={selectedApplicantIds.includes(applicant.id) && "selected"}>
                <TableCell>
                   <Checkbox
                      checked={selectedApplicantIds.includes(applicant.id)}
                      onCheckedChange={(checked) => handleSelectOne(applicant.id, !!checked)}
                      aria-label={`Select ${applicant.name}`}
                    />
                </TableCell>
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
                    onNoteAdd={handleNoteAdd}
                />
            )}
        </SheetContent>
      </Sheet>
      
       <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Bulk Message</DialogTitle>
                    <DialogDescription>
                        Your message will be sent to {selectedApplicantIds.length} selected applicant(s). This is a simulation.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea 
                        placeholder="Type your message here..."
                        value={bulkMessage}
                        onChange={(e) => setBulkMessage(e.target.value)}
                        className="min-h-[120px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSendBulkMessage} disabled={!bulkMessage.trim()}>Send Message</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

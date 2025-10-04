
"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  type Applicant,
  type Job,
  type ApplicantStatus,
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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
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
import { ChevronDown, Download, MessageSquare, XCircle, CheckCircle2, Loader2, ArrowUpDown, User as UserIcon, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { updateApplicantStatus } from "@/lib/actions";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";


const statusOptions: ApplicantStatus[] = [
    'applied',
    'under_review',
    'shortlisted',
    'interview_scheduled',
    'offer_made',
    'hired',
    'rejected',
];

const statusVariantMap: { [key in ApplicantStatus]: "default" | "secondary" | "outline" | "destructive" } = {
    applied: 'outline',
    under_review: 'secondary',
    shortlisted: 'secondary',
    interview_scheduled: 'default',
    offer_made: 'default',
    hired: 'default',
    rejected: 'destructive',
};

type ApplicantManagementProps = {
    initialApplicants: Applicant[];
    initialJobs: Job[];
    initialJobId: string;
}

export function ApplicantManagement({ initialApplicants, initialJobs, initialJobId }: ApplicantManagementProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [applicants, setApplicants] = React.useState<Applicant[]>(initialApplicants || []);
  const [selectedJob, setSelectedJob] = React.useState(initialJobId);
  
  const [selectedApplicant, setSelectedApplicant] = React.useState<Applicant | null>(null);
  const [selectedApplicantIds, setSelectedApplicantIds] = React.useState<number[]>([]);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = React.useState(false);
  const [bulkMessage, setBulkMessage] = React.useState("");
  const { toast } = useToast();

  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc' | null>(null);
  const [filterRange, setFilterRange] = React.useState<[number, number]>([0, 100]);
  const [statusFilter, setStatusFilter] = React.useState<ApplicantStatus[]>([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = React.useState(false);
  
  const jobs = initialJobs || [];

   React.useEffect(() => {
    setApplicants(initialApplicants || []);
  }, [initialApplicants]);

  const handleJobChange = (jobId: string) => {
    setSelectedJob(jobId);
    const params = new URLSearchParams(searchParams.toString());
    params.set('jobId', jobId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = async (applicantId: number, newStatus: ApplicantStatus) => {
    const result = await updateApplicantStatus(applicantId, newStatus);

    if (result.success) {
      setApplicants(prevApplicants =>
          prevApplicants.map(applicant =>
              applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
          )
      );
      if (selectedApplicant?.id === applicantId) {
          setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
      }
      toast({ title: "Status Updated", description: `Applicant status changed to "${newStatus}".` });
    } else {
      toast({ variant: "destructive", title: "Update Failed", description: result.error });
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
    setSelectedApplicantIds(checked ? filteredAndSortedApplicants.map((a) => a.id) : []);
  };

  const handleSelectOne = (applicantId: number, checked: boolean) => {
    setSelectedApplicantIds((prev) =>
      checked ? [...prev, applicantId] : prev.filter((id) => id !== applicantId)
    );
  };

  const handleBulkStatusChange = async (newStatus: ApplicantStatus) => {
    toast({
        title: "Bulk Updating...",
        description: `Updating ${selectedApplicantIds.length} applicants to "${newStatus}".`,
    });

    const updatePromises = selectedApplicantIds.map(id => updateApplicantStatus(id, newStatus));
    const results = await Promise.all(updatePromises);

    const successfulUpdates = results.filter(r => r.success).length;
    const failedUpdates = results.length - successfulUpdates;

    if (successfulUpdates > 0) {
        setApplicants(prevApplicants =>
            prevApplicants.map(applicant =>
                selectedApplicantIds.includes(applicant.id) ? { ...applicant, status: newStatus } : applicant
            )
        );
         toast({
            title: "Bulk Update Complete",
            description: `${successfulUpdates} applicants have been updated to "${newStatus}".`,
        });
    }

    if (failedUpdates > 0) {
        toast({
            variant: "destructive",
            title: "Some Updates Failed",
            description: `${failedUpdates} applicant statuses could not be updated.`,
        });
    }

    setSelectedApplicantIds([]);
  };

  const handleExport = () => {
    const selected = applicants.filter(a => selectedApplicantIds.includes(a.id));
    const headers = ["ID", "Name", "Email", "Job Title", "Status", "Applied On", "Resume URL", "Fit Score"];
    const csvContent = [
        headers.join(','),
        ...selected.map(a => [
            a.id,
            `"${a.applicant_profile.full_name.replace(/"/g, '""')}"`,
            a.applicant_profile.email,
            `"${a.jobTitle.replace(/"/g, '""')}"`,
            a.status,
            a.applied_at,
            a.resume,
            a.ai_remarks.fit_score
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
  
  const handleStatusFilterChange = (status: ApplicantStatus) => {
    setStatusFilter(prev => 
        prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  }

  const filteredAndSortedApplicants = React.useMemo(() => {
    let result = [...applicants];
    
    // Filtering by Status
    if (statusFilter.length > 0) {
        result = result.filter(a => statusFilter.includes(a.status));
    }

    // Filtering by AI Fit Score Range
    result = result.filter(a => {
        const score = a.ai_remarks?.fit_score ? parseFloat(a.ai_remarks.fit_score) : -1;
        return score >= filterRange[0] && score <= filterRange[1];
    });

    // Sorting by AI Fit Score
    if(sortOrder) {
        result.sort((a, b) => {
            const scoreA = a.ai_remarks?.fit_score ? parseFloat(a.ai_remarks.fit_score) : -1;
            const scoreB = b.ai_remarks?.fit_score ? parseFloat(b.ai_remarks.fit_score) : -1;
            if (sortOrder === 'asc') {
                return scoreA - scoreB;
            } else {
                return scoreB - scoreA;
            }
        });
    }

    return result;
  }, [applicants, sortOrder, filterRange, statusFilter]);

  const clearAllFilters = () => {
    setSortOrder(null);
    setFilterRange([0, 100]);
    setStatusFilter([]);
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Applicant Management</CardTitle>
        <CardDescription>
          View, analyze, and manage all applicants for your job postings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedJob} onValueChange={handleJobChange}>
              <SelectTrigger className="w-[280px]">
                 <SelectValue placeholder="Filter by job..." />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={String(job.id)}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedApplicantIds.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{selectedApplicantIds.length} of {applicants.length} selected</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem key="bulk-shortlist" onSelect={() => handleBulkStatusChange('shortlisted')}>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Shortlist
                    </DropdownMenuItem>
                    <DropdownMenuItem key="bulk-reject" onSelect={() => handleBulkStatusChange('rejected')} className="text-destructive focus:text-destructive">
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem key="bulk-message" onSelect={() => setIsMessageDialogOpen(true)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem key="bulk-export" onSelect={handleExport}>
                      <Download className="mr-2 h-4 w-4" />
                      Export List (.csv)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            {(sortOrder || filterRange[0] !== 0 || filterRange[1] !== 100 || statusFilter.length > 0) && (
              <Button variant="ghost" onClick={clearAllFilters} className="text-sm">Clear Filters</Button>
            )}
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                     <Checkbox
                        checked={
                          filteredAndSortedApplicants.length > 0 && selectedApplicantIds.length === filteredAndSortedApplicants.length
                        }
                        onCheckedChange={(checked) => handleSelectAll(checked)}
                        aria-label="Select all"
                      />
                  </TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                                <span>Status</span>
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {statusOptions.map(status => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    checked={statusFilter.includes(status)}
                                    onSelect={(e) => e.preventDefault()}
                                    onCheckedChange={() => handleStatusFilterChange(status)}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                </DropdownMenuCheckboxItem>
                            ))}
                             <DropdownMenuSeparator />
                             <DropdownMenuItem onClick={() => setStatusFilter([])}>
                                Clear Status Filter
                             </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableHead>
                  <TableHead>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
                          <span>AI Fit Score</span>
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => setSortOrder('desc')}>High to Low</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOrder('asc')}>Low to High</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsFilterDialogOpen(true)}>
                            <SlidersHorizontal className="mr-2 h-4 w-4" /> Filter by Range
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSortOrder(null)}>Clear Sorting</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedApplicants.map((applicant) => (
                  <TableRow key={applicant.id} data-state={selectedApplicantIds.includes(applicant.id) && "selected"}>
                    <TableCell>
                       <Checkbox
                          checked={selectedApplicantIds.includes(applicant.id)}
                          onCheckedChange={(checked) => handleSelectOne(applicant.id, !!checked)}
                          aria-label={`Select ${applicant.applicant_profile.full_name}`}
                        />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        
                        
                        <div>
                          <div className="font-medium">{applicant.applicant_profile.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {applicant.applicant_profile.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(applicant.applied_at), "PPP")}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[applicant.status]}>{applicant.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {applicant.ai_remarks?.fit_score ? (
                                <>
                                    <Progress value={parseFloat(applicant.ai_remarks.fit_score)} className="w-24 h-2" />
                                    <span className="text-sm font-medium">{applicant.ai_remarks.fit_score}%</span>
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

             <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Filter by AI Fit Score</DialogTitle>
                        <DialogDescription>
                           Show applicants with a score between {filterRange[0]}% and {filterRange[1]}%.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Slider
                            defaultValue={filterRange}
                            onValueChange={setFilterRange}
                            max={100}
                            step={5}
                        />
                         <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{filterRange[0]}%</span>
                            <span>{filterRange[1]}%</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFilterRange([0, 100])}>Clear Range</Button>
                        <Button onClick={() => setIsFilterDialogOpen(false)}>Apply</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

    
    

"use client";

import * as React from "react";
import {
  MoreHorizontal,
  PlusCircle,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Copy,
  Trash2,
  FileX,
  CopyPlus,
  Share2
} from "lucide-react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import type { Job } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { JobForm } from "./job-form";
import { useToast } from "@/hooks/use-toast";
import { createOrUpdateJob, deleteJob, deactivateJob } from "@/lib/actions";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const statusBadgeVariant: { [key in Job["status"]]: "default" | "secondary" | "outline" } = {
  Active: "default",
  Draft: "secondary",
  Closed: "outline",
};

export function JobManagement({ initialJobs }: { initialJobs: Job[] }) {
  const [jobs, setJobs] = React.useState<Job[]>(initialJobs || []);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [isCopyLinkOpen, setIsCopyLinkOpen] = React.useState(false);
  const [linkToCopy, setLinkToCopy] = React.useState("");
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [actionToConfirm, setActionToConfirm] = React.useState<(() => void) | null>(null);
  const [alertContent, setAlertContent] = React.useState({ title: '', description: '' });
  const { toast } = useToast();


  const handleCreateNew = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  }

  const handleCopyJob = (job: Job) => {
    const { id, status, is_active, applications_count, ...jobCopy } = job;
    setSelectedJob({
      ...jobCopy,
      title: `${job.title} (Copy)`,
    });
    setIsFormOpen(true);
  };

  const handleOpenCopyDialog = (jobId: number) => {
    const link = `${window.location.origin}/jobs/${jobId}`;
    setLinkToCopy(link);
    setIsCopyLinkOpen(true);
  };

  const handleActualCopy = () => {
    // Get the input element by ID
    const linkInput = document.getElementById('link') as HTMLInputElement;
    const linkText = linkInput?.value?.trim() || linkToCopy.trim();

    // Select the text in the input itself
    linkInput?.select();
    linkInput?.setSelectionRange(0, linkText.length);

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        toast({
          title: "Link Copied!",
          description: "The public link has been copied to your clipboard.",
        });
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = linkText;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }

    setIsCopyLinkOpen(false);
  };


  const handleConfirmAction = (job: Job, action: 'delete' | 'close') => {
    let title = '';
    let description = '';
    let onConfirm: () => Promise<void>;

    if (action === 'delete') {
      title = `Are you sure you want to delete the "${job.title}" position?`;
      description = 'This action cannot be undone. This will permanently remove the job posting.';
      onConfirm = async () => {
        const result = await deleteJob(job.id);
        if (result.success) {
          setJobs(prev => prev.filter(j => j.id !== job.id));
          toast({ title: "Job Deleted", description: `"${job.title}" has been deleted.` });
        } else {
          toast({ variant: "destructive", title: "Deletion Failed", description: result.error });
        }
      };
    } else { // 'close' action
      title = `Are you sure you want to mark "${job.title}" as inactive?`;
      description = 'This will close the job to new applicants. You can reactivate it later.';
      onConfirm = async () => {
        const result = await deactivateJob(job.id);
        if (result.success) {
          setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: 'Closed', is_active: false } : j));
          toast({ title: "Job Deactivated", description: `"${job.title}" is now inactive.` });
        } else {
          toast({ variant: "destructive", title: "Deactivation Failed", description: result.error });
        }
      };
    }

    setAlertContent({ title, description });
    setActionToConfirm(() => onConfirm);
    setIsAlertOpen(true);
  }

  const handleFormSubmit = async (values: Partial<Job>, status: 'Active' | 'Draft' | 'Closed') => {
    const result = await createOrUpdateJob(values, status);

    if (result.success && result.data) {
      setJobs(prev => {
        const newJob = result.data as Job;
        if (values.id) {
          // Find the job in the list and update it
          return prev.map(j => j.id === values.id ? newJob : j);
        }
        // For new jobs, we prepend it to the list.
        return [newJob, ...prev];
      });

      toast({
        title: values.id ? "Job Updated" : "Job Created",
        description: `Your job posting for "${result.data.title}" has been saved.`,
      });
      setIsFormOpen(false);
      setSelectedJob(null);
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  };

  const getApplicantCount = (job: Job) => {
    return job.applications_count ?? 0;
  }

  const formatDatePosted = (date: Date | string) => {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch (error) {
      console.error("Failed to format date:", date, error);
      return "Invalid date";
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">Job Postings</CardTitle>
              <CardDescription>
                Create, manage, and track all your company's job listings.
              </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1" onClick={handleCreateNew}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Job
              </span>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(jobs || []).map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <CardTitle className="font-headline text-lg truncate">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.workingMode}</span>
                    <span className="flex items-center gap-1.5 truncate"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => handleEdit(job)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleCopyJob(job)}>
                      <CopyPlus className="mr-2 h-4 w-4" />
                      Copy Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenCopyDialog(job.id)}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Copy Public Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => handleConfirmAction(job, 'close')} disabled={job.status === 'Closed'}>
                      <FileX className="mr-2 h-4 w-4" />
                      Mark as Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleConfirmAction(job, 'delete')} className="text-destructive focus:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <Badge variant={job.is_active ? 'default' : 'outline'}>{job.is_active ? 'Active' : 'Closed'}</Badge>
              <div className="text-sm text-muted-foreground line-clamp-3">{job.description}</div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                <span>{getApplicantCount(job)} Applicants</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>Posted {formatDatePosted(job.datePosted)}</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-headline text-xl">{selectedJob?.id ? "Edit Job Posting" : "Create New Job Posting"}</DialogTitle>
            <DialogDescription>
              {selectedJob?.id ? "Update the details for this job listing." : "Fill in the form below to create a new job listing."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 px-6">
            <JobForm
              job={selectedJob}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {alertContent.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActionToConfirm(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (actionToConfirm) actionToConfirm();
              setIsAlertOpen(false);
              setActionToConfirm(null);
            }}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isCopyLinkOpen} onOpenChange={setIsCopyLinkOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Job Link</DialogTitle>
            <DialogDescription>
              Anyone with this link will be able to view the public job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                defaultValue={linkToCopy}
                readOnly
              />
            </div>
            <Button type="button" size="sm" className="px-3" onClick={handleActualCopy}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={() => setIsCopyLinkOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

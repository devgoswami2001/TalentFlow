
"use client";

import * as React from "react";
import {
  MoreHorizontal,
  PlusCircle,
  MapPin,
  Briefcase,
  Calendar,
  Users,
  Copy
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  jobs as initialJobs,
  applicants as allApplicants,
  type Job,
} from "@/lib/data";
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
  DialogDescription
} from "@/components/ui/dialog";
import { JobForm } from "./job-form";
import { useToast } from "@/hooks/use-toast";

const statusBadgeVariant: { [key in Job["status"]]: "default" | "secondary" | "outline" } = {
  Active: "default",
  Draft: "secondary",
  Closed: "outline",
};

export function JobManagement() {
  const [jobs, setJobs] = React.useState<Job[]>(initialJobs);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const [actionToConfirm, setActionToConfirm] = React.useState<(() => void) | null>(null);
  const [alertContent, setAlertContent] = React.useState({title: '', description: ''});
  const { toast } = useToast();


  const handleCreateNew = () => {
    setSelectedJob(null);
    setIsFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleStatusChange = (jobId: number, status: Job['status']) => {
    setJobs(jobs.map(j => j.id === jobId ? {...j, status} : j));
  }
  
  const handleCopyLink = (jobId: number) => {
    const link = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(link);
    toast({
        title: "Link Copied!",
        description: "Public link for the job has been copied to your clipboard.",
    });
  }

  const handleConfirmAction = (job: Job, action: 'close' | 'duplicate') => {
      let title = '';
      let description = '';
      let onConfirm: () => void;

      if (action === 'close') {
          title = `Are you sure you want to close the "${job.title}" position?`;
          description = 'This will change the job status to "Closed" and it will no longer be visible to new applicants. This action can be undone.';
          onConfirm = () => handleStatusChange(job.id, 'Closed');
      } else { // duplicate
          title = `Are you sure you want to duplicate the "${job.title}" position?`;
          description = 'This will create a new job posting with the same details, but with the status set to "Draft".';
          onConfirm = () => {
             const newJob: Job = {
                ...job,
                id: Math.max(...jobs.map(j => j.id)) + 1,
                status: 'Draft',
                datePosted: new Date()
             };
             setJobs(prev => [newJob, ...prev]);
          };
      }
      setAlertContent({ title, description });
      setActionToConfirm(() => onConfirm);
      setIsAlertOpen(true);
  }

  const handleFormSubmit = (values: Job, status: 'Draft' | 'Active') => {
    const isEditing = !!selectedJob;
    if (isEditing) {
      setJobs(jobs.map((j) => (j.id === values.id ? { ...values, status } : j)));
    } else {
      setJobs([{ ...values, status }, ...jobs]);
    }
    setIsFormOpen(false);
    setSelectedJob(null);
  };

  const getApplicantCount = (jobId: number) => {
    return allApplicants.filter(a => a.jobId === jobId).length;
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
        {jobs.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                     <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" />{job.workingMode}</span>
                     <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() => handleEdit(job)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleCopyLink(job.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Public Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleConfirmAction(job, 'duplicate')}>Duplicate</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => handleConfirmAction(job, 'close')} className="text-red-600">
                      Close Job
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               <Badge variant={statusBadgeVariant[job.status]}>{job.status}</Badge>
               <div className="text-sm text-muted-foreground line-clamp-3">{job.description}</div>
            </CardContent>
            <CardFooter className="flex justify-between text-xs text-muted-foreground pt-4 border-t">
                 <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    <span>{getApplicantCount(job.id)} Applicants</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>Posted {formatDistanceToNow(job.datePosted, { addSuffix: true })}</span>
                 </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="font-headline text-xl">{selectedJob ? "Edit Job Posting" : "Create New Job Posting"}</DialogTitle>
            <DialogDescription>
              {selectedJob ? "Update the details for this job listing." : "Fill in the form below to create a new job listing."}
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
                    if(actionToConfirm) actionToConfirm();
                    setIsAlertOpen(false);
                    setActionToConfirm(null);
                }}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
       </AlertDialog>
    </div>
  );
}

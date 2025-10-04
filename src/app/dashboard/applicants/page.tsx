import { ApplicantManagement } from '@/components/applicant-management';
import { getApplicantsForJob, getMyJobs } from "@/lib/actions";
import type { Applicant, Job } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function ApplicantsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Unwrap the async searchParams before accessing its properties
  const sp = await searchParams;
  const jobIdRaw = sp.jobId;
  const jobId = Array.isArray(jobIdRaw)
    ? Number(jobIdRaw[0])
    : jobIdRaw
    ? Number(jobIdRaw)
    : undefined;

  const jobsResult = await getMyJobs();
  if (jobsResult.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Jobs</AlertTitle>
        <AlertDescription>
          Could not load your job postings to fetch applicants.
          <p className="font-mono text-xs mt-2">{jobsResult.error}</p>
        </AlertDescription>
      </Alert>
    );
  }
  const jobs: Job[] = jobsResult.data || [];

  let applicants: Applicant[] = [];
  let error: string | null = null;

  const targetJobId = jobId || jobs[0]?.id;

  if (targetJobId) {
    const targetJob = jobs.find((j) => j.id === targetJobId);
    if (targetJob) {
      const applicantsResult = await getApplicantsForJob(
        targetJobId,
        targetJob.title
      );
      if (applicantsResult.success) {
        applicants = applicantsResult.data || [];
      } else {
        error = applicantsResult.error || "Failed to fetch applicants.";
      }
    } else if (jobId) {
      error = `Job with ID ${jobId} not found.`;
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Fetching Applicants</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ApplicantManagement
      initialApplicants={applicants}
      initialJobs={jobs}
      initialJobId={targetJobId ? String(targetJobId) : 'all'}
    />
  );
}

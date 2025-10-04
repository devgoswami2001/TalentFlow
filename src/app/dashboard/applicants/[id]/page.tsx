import { applicants as mockApplicants, jobs as mockJobs } from "@/lib/data";
import { notFound } from "next/navigation";
import { getApplicantsForJob, getJobById } from "@/lib/actions";
import { ApplicantProfilePage } from "@/components/applicant-profile-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { Applicant, Job } from "@/lib/data";

async function getApplicantAndJob(applicantId: number, jobId: number | undefined) {
  let job: Job | null = null;

  // Try fetch job by ID if provided
  if (jobId) {
    const jobResult = await getJobById(jobId);
    if (jobResult.data) {
      job = jobResult.data;
    } else {
      // Fallback to mock job
      const mockJob = mockJobs.find((j) => j.id === jobId);
      if (mockJob) job = mockJob;
    }
  }

  // If still no job, try to infer from applicant mock data
  if (!job) {
    const mockApplicant = mockApplicants.find((a) => a.id === applicantId);
    if (mockApplicant && mockApplicant.jobId) {
      const mockJob = mockJobs.find((j) => j.id === mockApplicant.jobId);
      if (mockJob) job = mockJob;
    }
  }

  if (!job) {
    return { applicant: null, job: null, error: `Could not find job information.` };
  }

  // Fetch applicants for the job
  const applicantsResult = await getApplicantsForJob(job.id, job.title);
  if (applicantsResult.success && applicantsResult.data) {
    const applicant = applicantsResult.data.find((a) => a.id === applicantId);
    if (applicant) {
      return { applicant, job, error: null };
    }
  }

  // Fallback to mock applicant
  const mockApplicant = mockApplicants.find((a) => a.id === applicantId);
  if (mockApplicant) {
    return { applicant: mockApplicant, job, error: null };
  }

  return { applicant: null, job: null, error: `Applicant with ID ${applicantId} not found.` };
}

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ Await params
  const applicantId = parseInt(id);

  if (isNaN(applicantId)) {
    notFound();
  }

  // We don’t know job ID from URL, so we pass undefined
  const { applicant, job, error } = await getApplicantAndJob(applicantId, undefined);

  if (error || !applicant || !job) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || "Could not load applicant details."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Build AI analysis object if remarks exist
  const analysis = applicant.ai_remarks
    ? {
        highlightedResume: "Resume content will be highlighted in the component.",
        skillsMatchPercentage: parseFloat(applicant.ai_remarks.fit_score),
      }
    : null;

  return (
    <ApplicantProfilePage
      applicant={applicant}
      job={job}
      analysis={analysis}
      analysisError={null}
    />
  );
}

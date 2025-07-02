
import { applicants, jobs } from "@/lib/data";
import { notFound } from "next/navigation";
import { getAnalysisForApplicant } from "@/lib/actions";
import { ApplicantProfilePage } from "@/components/applicant-profile-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default async function ApplicantDetailPage({ params }: { params: { id: string } }) {
  const applicant = applicants.find(a => a.id === parseInt(params.id));

  if (!applicant) {
    notFound();
  }

  const job = jobs.find(j => j.id === applicant.jobId);

  if (!job) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error: Job not found</AlertTitle>
            <AlertDescription>
                The job associated with this applicant (ID: {applicant.jobId}) could not be found. It may have been deleted.
            </AlertDescription>
        </Alert>
    )
  }
  
  let analysisResult = null;
  let analysisError = null;
  try {
      analysisResult = await getAnalysisForApplicant(applicant.resumeText, job.description);
  } catch(e: any) {
      analysisError = e.message || "Failed to load AI analysis.";
  }
  
  return <ApplicantProfilePage applicant={applicant} job={job} analysis={analysisResult} analysisError={analysisError} />;
}


import { getMyJobs } from "@/lib/actions";
import { JobManagement } from "@/components/job-management";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default async function JobsPage() {
  const { data, error } = await getMyJobs();

  if (error) {
    return (
        <div className="container mx-auto py-10">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Fetching Jobs</AlertTitle>
                <AlertDescription>
                    Could not load your job postings. Please try again later.
                    <p className="font-mono text-xs mt-2">{error}</p>
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  // Pass the array of jobs directly to the component
  return (
    <JobManagement initialJobs={data || []} />
  );
}

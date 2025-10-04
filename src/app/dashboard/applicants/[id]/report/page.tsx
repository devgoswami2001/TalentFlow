import { getApplicantProgressReport } from "@/lib/actions";
import { ApplicantProgressReport } from "@/components/applicant-progress-report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";

export default async function ProgressReportPage({ params }: { params: { id: string } }) {
  const { data, error } = await getApplicantProgressReport(params.id);

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Link
          href="/dashboard/applicants"
          className="flex items-center gap-3 group absolute top-8 left-8"
        >
          <Icons.logo className="h-8 w-8" />
          <span className="text-2xl font-bold font-headline">Hyresense</span>
        </Link>
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Report</AlertTitle>
          <AlertDescription>
            {error || "Could not load the applicant's progress report. Please try again later."}
          </AlertDescription>
          <div className="mt-4">
            <Button asChild variant="secondary">
              <Link href="/dashboard/applicants">Back to Applicants</Link>
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return <ApplicantProgressReport data={data} />;
}

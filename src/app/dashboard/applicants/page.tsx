import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from 'lucide-react';

export default function ApplicantsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Applicants</CardTitle>
        <CardDescription>
          This is where you will manage all applicants across all jobs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Applicant Management Coming Soon</h3>
          <p className="text-muted-foreground">
            A comprehensive list of all candidates will be available here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

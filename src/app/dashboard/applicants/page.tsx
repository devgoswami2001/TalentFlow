import { ApplicantManagement } from '@/components/applicant-management';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function ApplicantsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Applicant Management</CardTitle>
        <CardDescription>
          View, analyze, and manage all applicants for your job postings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ApplicantManagement />
      </CardContent>
    </Card>
  );
}

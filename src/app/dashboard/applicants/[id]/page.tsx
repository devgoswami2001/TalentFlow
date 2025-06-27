
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function ApplicantDetailPage({ params }: { params: { id: string } }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Applicant Profile</CardTitle>
        <CardDescription>
          Full profile view for applicant ID: {params.id}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <UserCircle className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Full Profile Page</h3>
          <p className="text-muted-foreground">
            This page will contain the detailed information and history for the selected applicant.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

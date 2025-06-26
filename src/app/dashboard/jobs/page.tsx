import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase } from 'lucide-react';

export default function JobsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Post a Job</CardTitle>
        <CardDescription>
          This is where you will create and manage job listings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <Briefcase className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Job Posting Form Coming Soon</h3>
          <p className="text-muted-foreground">
            The form to create new job posts will be implemented here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

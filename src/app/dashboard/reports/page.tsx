import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AreaChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Reports</CardTitle>
        <CardDescription>
          This is where you will find analytics and insights.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <AreaChart className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Analytics & Reports Coming Soon</h3>
          <p className="text-muted-foreground">
            Track key hiring metrics and performance insights here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

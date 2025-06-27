import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Users, Clock, Zap } from 'lucide-react';
import { applicants } from "@/lib/data";
import { HiringFunnelChart } from "@/components/hiring-funnel-chart";
import { SourceOfHireChart } from "@/components/source-of-hire-chart";

export default function ReportsPage() {

  const totalApplicants = applicants.length;
  const totalHired = applicants.filter(a => a.status === 'Hired').length;
  const offerCount = applicants.filter(a => ['Offer', 'Hired'].includes(a.status)).length;
  const acceptanceRate = offerCount > 0 ? ((totalHired / offerCount) * 100).toFixed(1) : "0.0";
  // Mock data for time to fill, in a real app this would be calculated
  const avgTimeToFill = 32;

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Reports & Analytics</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
            <p className="text-xs text-muted-foreground">
              Across all active jobs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hired</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHired}</div>
             <p className="text-xs text-muted-foreground">
              Candidates successfully hired
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time to Fill</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgTimeToFill} days</div>
            <p className="text-xs text-muted-foreground">
              From posting to hiring
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offer Acceptance</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{acceptanceRate}%</div>
            <p className="text-xs text-muted-foreground">
              Offers accepted by candidates
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Hiring Funnel</CardTitle>
            <CardDescription>
              Conversion rates across different hiring stages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HiringFunnelChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Source of Hire</CardTitle>
            <CardDescription>
              Where your best candidates are coming from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SourceOfHireChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

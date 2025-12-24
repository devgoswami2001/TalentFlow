
// app/dashboard/page.tsx
import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Users,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ApplicationTrendsChart from '@/components/application-trends-chart'; // ✅
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDashboardPageData } from '@/lib/actions';
import { HiringFunnelChart } from '@/components/hiring-funnel-chart';
import { User as UserIcon } from 'lucide-react';
import MiniTrendChart from '@/components/mini-trend-chart';


export default async function DashboardPage() {
   const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const { stats, trends, error } = await getDashboardPageData(accessToken); // optionally pass it

  if (error || !stats) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Failed to load dashboard data</AlertTitle>
        <AlertDescription>
          There was an error fetching the dashboard statistics. Please try refreshing the page. If the problem persists, you may need to log in again.
          <p className="font-mono text-xs mt-2">Error: {error}</p>
        </AlertDescription>
      </Alert>
    );
  }

  const recentApplicants = stats.recent_activities?.recent_applications || [];
  const topJobs = stats.recent_activities?.top_performing_jobs || [];
  
  const funnelChartData = [
    { name: 'Applied', value: stats.stats.total_applications || 0, fill: 'hsl(var(--chart-1))' },
    { name: 'Shortlisted', value: stats.stats.shortlisted_applications || 0, fill: 'hsl(var(--chart-2))' },
    // The API doesn't provide interview/offer stages, so we'll estimate or skip them for now
    // For a better UX, we can make assumptions. E.g., hired candidates must have been offered.
    { name: 'Hired', value: stats.stats.hired_candidates || 0, fill: 'hsl(var(--chart-5))' },
  ];

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stats.active_jobs}</div>
            <p className="text-xs text-muted-foreground">Currently open positions</p>
             {trends?.daily_jobs_created && (
              <div className="h-16 -ml-6 -mr-2">
                <MiniTrendChart data={trends.daily_jobs_created} dataKey="total" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stats.total_applications}</div>
            <p className="text-xs text-muted-foreground">Across all job postings</p>
            {trends?.daily_applications && (
              <div className="h-16 -ml-6 -mr-2">
                <MiniTrendChart data={trends.daily_applications} dataKey="total" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hired</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stats.hired_candidates}</div>
            <p className="text-xs text-muted-foreground">Candidates successfully hired</p>
             {trends?.daily_applications && (
              <div className="h-16 -ml-6 -mr-2">
                <MiniTrendChart data={trends.daily_applications} dataKey="hired" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.stats.pending_applications}</div>
            <p className="text-xs text-muted-foreground">New candidates awaiting review</p>
            {trends?.daily_applications && (
              <div className="h-16 -ml-6 -mr-2">
                <MiniTrendChart data={trends.daily_applications} dataKey="pending" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>A summary of job applications over the past months.</CardDescription>
          </CardHeader>
          <CardContent>
             <ApplicationTrendsChart data={trends?.monthly_applications ?? []} />
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
            <CardDescription>
              The latest candidates who have applied to your jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentApplicants.length > 0 ? (
                recentApplicants.map((applicant: any) => (
                  <div key={applicant.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                       <AvatarImage src={applicant.applicant_profile.profile_picture ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${applicant.applicant_profile.profile_picture}` : ''} alt="Avatar" data-ai-hint="person portrait" />
                      <AvatarFallback><UserIcon className="h-5 w-5"/></AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {applicant.applicant_profile.full_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {applicant.applicant_profile.email}
                      </p>
                    </div>
                    {/* The jobTitle is not available in the new recent_applications structure */}
                    {/* <div className="ml-auto font-medium">{applicant.jobTitle}</div> */}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">No recent applicants.</div>
              )}
            </div>
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
            <HiringFunnelChart data={funnelChartData} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Top Performing Jobs</CardTitle>
            <CardDescription>
              Your most popular job postings by application count.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead className="text-right">Applicants</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topJobs.length > 0 ? (
                        topJobs.slice(0, 5).map((job: any) => (
                            <TableRow key={job.job_id}>
                                <TableCell>
                                    <div className="font-medium">{job.job_title}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Posted: {job.created_date}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-lg">
                                    {job.applications_count}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                                No job performance data available yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
             <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/jobs">View All Jobs</Link>
             </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

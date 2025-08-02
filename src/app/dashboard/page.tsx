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

export default async function DashboardPage() {
   const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const { stats, monthlyData, error } = await getDashboardPageData(accessToken); // optionally pass it

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

  const recentApplicants = stats.recent_applications || [];

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
            <ApplicationTrendsChart data={monthlyData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Applicants</CardTitle>
              <CardDescription>Recently applied candidates for open positions.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/applicants">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplicants.length > 0 ? (
                  recentApplicants.map((applicant: any) => (
                    <TableRow key={applicant.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={
                                applicant.applicant_details.user.avatar ||
                                `https://placehold.co/40x40`
                              }
                              alt={applicant.applicant_details.user.first_name}
                            />
                            <AvatarFallback>
                              {applicant.applicant_details.user.first_name?.charAt(0) ?? ''}
                              {applicant.applicant_details.user.last_name?.charAt(0) ?? ''}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {applicant.applicant_details.user.first_name}{' '}
                              {applicant.applicant_details.user.last_name}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {applicant.applicant_details.user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{applicant.job_details.title}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            applicant.status === 'Interview'
                              ? 'default'
                              : applicant.status === 'Shortlisted'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {applicant.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      No recent applicants.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}


import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Users,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

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
import { ApplicationTrendsChart } from '@/components/application-trends-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { jobs, applicants } from '@/lib/data';

export default function DashboardPage() {
  const activeJobsCount = jobs.filter(job => job.status === 'Active').length;
  const newApplicantsCount = applicants.length;
  const hiredThisMonthCount = applicants.filter(applicant => applicant.status === 'Hired').length;
  const recentApplicants = applicants.slice(0, 4);

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
            <div className="text-2xl font-bold">{activeJobsCount}</div>
            <p className="text-xs text-muted-foreground">
              Currently open positions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newApplicantsCount}</div>
            <p className="text-xs text-muted-foreground">
              Across all job postings
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hired</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hiredThisMonthCount}</div>
            <p className="text-xs text-muted-foreground">
              Candidates successfully hired
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +20.1% since last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Application Trends</CardTitle>
            <CardDescription>
              A summary of job applications over the past months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicationTrendsChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Applicants</CardTitle>
              <CardDescription>
                Recently applied candidates for open positions.
              </CardDescription>
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
                {recentApplicants.map((applicant) => (
                    <TableRow key={applicant.id}>
                        <TableCell>
                            <div className='flex items-center gap-3'>
                            <Avatar>
                                <AvatarImage src={applicant.avatar} alt={applicant.name} data-ai-hint="person portrait"/>
                                <AvatarFallback>{applicant.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{applicant.name}</div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                {applicant.email}
                                </div>
                            </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{applicant.jobTitle}</div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Badge variant={applicant.status === 'Interview' ? 'default' : applicant.status === 'Shortlisted' ? 'secondary' : 'outline'}>{applicant.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

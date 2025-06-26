import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Users,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Applications',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hired This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+5</div>
            <p className="text-xs text-muted-foreground">
              +1 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              +201 since last hour
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
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              </BarChart>
            </ChartContainer>
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
                <TableRow>
                  <TableCell>
                    <div className="font-medium">Liam Johnson</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      liam@example.com
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">Software Engineer</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">Applied</Badge>
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Olivia Smith</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      olivia@example.com
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">Product Manager</div>
                  </TableCell>
                  <TableCell className="text-right">
                     <Badge>Shortlisted</Badge>
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Noah Williams</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      noah@example.com
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">UX Designer</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">Applied</Badge>
                  </TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">Emma Brown</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      emma@example.com
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">Data Scientist</div>
                  </TableCell>
                   <TableCell className="text-right">
                     <Badge>Interview</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

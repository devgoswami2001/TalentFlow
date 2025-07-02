
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { Briefcase, MapPin, DollarSign, Calendar, ExternalLink, XCircle } from 'lucide-react';

import { jobs } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = jobs.find(j => j.id === parseInt(params.id));

  if (!job) {
    notFound();
  }

  const PageHeader = () => (
     <header className="mb-8 flex justify-between items-center">
        <Link
        href="/"
        className="flex items-center gap-2 font-semibold font-headline text-2xl"
        >
        <Icons.logo className="h-8 w-8" />
        <span>Hyresense</span>
        </Link>
    </header>
  );

  const PageFooter = () => (
      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Hyresense. All rights reserved.</p>
    </footer>
  );

  return (
    <div className="bg-background min-h-screen">
        <div className="absolute inset-0 -z-10 h-1/2 bg-gradient-to-b from-primary/10 to-transparent"></div>
        <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            <PageHeader />

            <Card className="shadow-lg border-primary/20">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Badge variant="secondary" className="mb-2">{job.experienceLevel}</Badge>
                        <CardTitle className="text-4xl font-headline text-primary">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground mt-4 text-sm">
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{job.location}</span>
                            <span className="flex items-center gap-2"><Briefcase className="w-4 h-4" />{job.employmentType}</span>
                            {job.salaryMin && job.salaryMax && (
                            <span className="flex items-center gap-2"><DollarSign className="w-4 h-4" />${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</span>
                            )}
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" />Posted on {format(job.datePosted, "PPP")}</span>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <Separator className="my-6" />

                <div>
                    <h3 className="font-headline text-xl mb-4">Job Description</h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {job.description}
                    </div>
                </div>

                <Separator className="my-6" />

                <div>
                    <h3 className="font-headline text-xl mb-4">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.map(skill => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                    </div>
                </div>

                {job.screeningQuestions && job.screeningQuestions.length > 0 && (
                <>
                    <Separator className="my-6" />
                    <div>
                    <h3 className="font-headline text-xl mb-4">Screening Questions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                        {job.screeningQuestions.map((q, i) => <li key={i}>{q}</li>)}
                    </ul>
                    </div>
                </>
                )}

            </CardContent>
            
            {job.status === 'Active' ? (
                <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-foreground">Application Deadline</p>
                        <p>{format(job.applicationDeadline, "PPP")}</p>
                    </div>
                    <Button size="lg">Apply Now <ExternalLink className="ml-2 h-4 w-4" /></Button>
                </CardFooter>
            ) : (
                <CardFooter className="p-0">
                    <Alert variant="destructive" className="w-full rounded-t-none rounded-b-lg border-x-0 border-b-0">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Position Closed</AlertTitle>
                        <AlertDescription>
                            This job is no longer accepting applications.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            )}

            </Card>

            <PageFooter />
        </div>
    </div>
  );
}

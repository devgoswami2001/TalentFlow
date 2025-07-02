import Link from 'next/link';
import Image from 'next/image';
import { jobs, newsPosts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Briefcase, MapPin, ArrowRight, Rss, Building, Camera, UserPlus, FilePenLine } from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const companyInfo = {
  name: 'Hyresense',
  tagline: 'Pioneering the Future of Talent Acquisition',
  description: 'Hyresense is at the forefront of revolutionizing the recruitment industry. We leverage cutting-edge AI and data analytics to create intelligent, intuitive, and efficient hiring solutions. Our mission is to connect exceptional talent with innovative companies, fostering growth and success for both.',
  longDescription: 'Founded on the principle that people are a company\'s greatest asset, Hyresense was built to bridge the gap between technology and human potential. Our platform streamlines the entire hiring pipeline, from job posting and applicant tracking to AI-powered resume analysis and collaborative team tools. We are committed to building a future where recruitment is not just a process, but a strategic advantage.',
  gallery: {
    images: [
      { src: 'https://placehold.co/800x600', alt: 'Modern office interior', hint: 'modern office' },
      { src: 'https://placehold.co/800x600', alt: 'Team collaborating on a project', hint: 'team collaboration' },
      { src: 'https://placehold.co/800x600', alt: 'Company event', hint: 'company event' },
      { src: 'https://placehold.co/800x600', alt: 'Close-up of our technology dashboard', hint: 'dashboard interface' },
    ]
  }
};

const activeJobs = jobs.filter(job => job.status === 'Active').slice(0, 3); // Show top 3
const latestNews = newsPosts.filter(post => post.visibility === 'Public').slice(0, 2); // Show latest 2

export function CompanyProfilePage() {
  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="absolute inset-0 -z-10 h-1/3 bg-gradient-to-b from-primary/20 to-transparent"></div>
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Card className="w-full shadow-2xl shadow-primary/10 border-primary/20 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary/80 to-accent/80 relative">
             <Image
                src="https://placehold.co/1200x400"
                alt="Company banner"
                data-ai-hint="abstract technology"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="flex items-end gap-4">
                    <div className="w-28 h-28 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center">
                        <Icons.logo className="h-16 w-16 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold font-headline text-primary-foreground shadow-sm">{companyInfo.name}</h1>
                        <p className="text-primary-foreground/90 mt-1">{companyInfo.tagline}</p>
                    </div>
                </div>
              </div>
          </div>
          
          <Tabs defaultValue="about" className="w-full">
            <div className="px-6 pt-4 pb-0 bg-card border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <TabsList>
                    <TabsTrigger value="about"><Building className="mr-2 h-4 w-4"/> About</TabsTrigger>
                    <TabsTrigger value="careers"><Briefcase className="mr-2 h-4 w-4"/> Careers ({activeJobs.length})</TabsTrigger>
                    <TabsTrigger value="news"><Rss className="mr-2 h-4 w-4"/> News</TabsTrigger>
                    <TabsTrigger value="gallery"><Camera className="mr-2 h-4 w-4"/> Gallery</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-3 shrink-0 pb-4 md:pb-0">
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Follow
                    </Button>
                    <Button variant="outline">
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Edit Profile
                    </Button>
                </div>
            </div>

            <CardContent className="p-0">
                <TabsContent value="about" className="p-6 mt-0">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline mb-4">Innovating Recruitment</h2>
                    <p className="text-muted-foreground leading-relaxed">{companyInfo.longDescription}</p>
                </TabsContent>

                <TabsContent value="careers" className="p-6 mt-0">
                     <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline mb-4">Open Positions</h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {activeJobs.map(job => (
                        <Card key={job.id} className="flex flex-col hover:border-primary/50 hover:shadow-lg transition-all">
                            <CardHeader>
                            <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 pt-1">
                                <MapPin className="w-4 h-4" /> {job.location}
                            </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                            <Badge variant="secondary">{job.experienceLevel}</Badge>
                            </CardContent>
                            <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={`/jobs/${job.id}`}>View Details <ArrowRight className="ml-2 w-4 h-4" /></Link>
                            </Button>
                            </CardFooter>
                        </Card>
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/jobs">View All Openings</Link>
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="news" className="p-6 mt-0">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline mb-4">What's Happening at Hyresense</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {latestNews.map(post => (
                            <Card key={post.id} className="overflow-hidden group">
                                {post.imageUrl && (
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        <Image
                                            src={post.imageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            data-ai-hint="company news"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <Badge variant="outline" className="w-fit mb-2">{post.category}</Badge>
                                    <CardTitle className="font-headline text-xl">{post.title}</CardTitle>
                                    <CardDescription>{format(new Date(post.timestamp), "PPP")}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="gallery" className="p-6 mt-0">
                     <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline mb-4">A Look Inside Hyresense</h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {companyInfo.gallery.images.map((image, index) => (
                            <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                                <Image src={image.src} alt={image.alt} data-ai-hint={image.hint} fill className="object-cover group-hover:scale-110 transition-transform duration-300"/>
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                   <p className="text-white font-bold text-center p-2 bg-black/50 rounded-md text-sm">{image.alt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { jobs, newsPosts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Icons } from '@/components/icons';
import { Briefcase, MapPin, ArrowRight, Rss, Building, Camera, Video } from 'lucide-react';
import { format } from 'date-fns';

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
    ],
    video: {
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video
      title: 'A Glimpse into Life at Hyresense'
    }
  }
};

const activeJobs = jobs.filter(job => job.status === 'Active').slice(0, 3); // Show top 3
const latestNews = newsPosts.filter(post => post.visibility === 'Public').slice(0, 2); // Show latest 2

export function CompanyProfilePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
        <Image
          src="https://placehold.co/1920x1080"
          alt="Abstract futuristic background"
          data-ai-hint="abstract futuristic"
          fill
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-transparent to-background"></div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-2xl">
             <div className="flex items-center justify-center gap-3 mb-4">
                <Icons.logo className="w-12 h-12 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight text-foreground font-headline sm:text-6xl">
                    {companyInfo.name}
                </h1>
            </div>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {companyInfo.tagline}
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 lg:px-8 py-16 sm:py-24 space-y-24">
        {/* About Us Section */}
        <section id="about" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="text-base font-semibold leading-7 text-primary flex items-center gap-2"><Building className="w-5 h-5" /> About Us</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Innovating Recruitment</p>
              <p className="mt-6 text-muted-foreground leading-relaxed">{companyInfo.longDescription}</p>
           </div>
           <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl shadow-primary/20">
              <Image src="https://placehold.co/800x600" alt="Our Team" data-ai-hint="diverse team" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           </div>
        </section>

        <Separator />

        {/* Open Positions Section */}
        <section id="careers">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-base font-semibold leading-7 text-primary flex items-center gap-2"><Briefcase className="w-5 h-5" /> Join Our Team</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Open Positions</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {activeJobs.map(job => (
              <Card key={job.id} className="flex flex-col hover:border-primary/50 hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{job.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-2">
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
           <div className="mt-10 text-center">
                <Button variant="outline" asChild>
                    <Link href="/dashboard/jobs">View All Openings</Link>
                </Button>
            </div>
        </section>

        <Separator />

         {/* News Feed Section */}
        <section id="news">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-base font-semibold leading-7 text-primary flex items-center gap-2"><Rss className="w-5 h-5" /> Latest News</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">What's Happening at Hyresense</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
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
        </section>

        <Separator />

        {/* Gallery Section */}
        <section id="gallery">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-base font-semibold leading-7 text-primary flex items-center gap-2"><Camera className="w-5 h-5" /> Photo Gallery</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">A Look Inside Hyresense</p>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {companyInfo.gallery.images.map((image, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                    <Image src={image.src} alt={image.alt} data-ai-hint={image.hint} fill className="object-cover group-hover:scale-110 transition-transform duration-300"/>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                </div>
            ))}
          </div>
          <div className="mt-16">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-base font-semibold leading-7 text-primary flex items-center gap-2"><Video className="w-5 h-5" /> Company Video</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">{companyInfo.gallery.video.title}</p>
            </div>
            <div className="mt-10 relative aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl shadow-primary/20 border">
                 <iframe 
                    width="100%" 
                    height="100%" 
                    src={companyInfo.gallery.video.src} 
                    title={companyInfo.gallery.video.title} 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                ></iframe>
            </div>
          </div>
        </section>
      </main>
      
       <footer className="border-t">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 text-center">
                 <div className="flex items-center justify-center gap-2 font-semibold font-headline text-2xl">
                    <Icons.logo className="h-8 w-8" />
                    <span>Hyresense</span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Hyresense. All rights reserved.</p>
            </div>
       </footer>

    </div>
  );
}

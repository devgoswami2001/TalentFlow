

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { CompanyProfile, Job, NewsPost } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { 
    Briefcase, 
    MapPin, 
    ArrowRight, 
    Rss, 
    Building, 
    UserPlus, 
    FilePenLine,
    Save,
    X,
    AlertTriangle,
    Loader2,
    Activity,
    Users
} from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateCompanyProfile } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';

type CompanyProfilePageProps = {
    initialCompanyInfo: CompanyProfile | null;
    initialNewsPosts: NewsPost[];
    initialJobs: Job[];
    error: string | null;
}

export function CompanyProfilePage({ initialCompanyInfo, initialNewsPosts, initialJobs, error }: CompanyProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyProfile | null>(initialCompanyInfo);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!companyInfo) return;
    const { name, value } = e.target;
    setCompanyInfo(prev => prev ? { ...prev, [name]: value } : null);
  };
  
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyInfo) return;
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    
    const result = await updateCompanyProfile(formData);

    if (result.success && result.data) {
        setCompanyInfo(result.data);
        toast({
            title: "Profile Updated",
            description: "Your company profile has been saved successfully.",
        });
        setIsEditing(false);
    } else {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: result.error || "An unknown error occurred.",
        });
    }
    
    setIsSaving(false);
  };

  const handleCancel = () => {
    setCompanyInfo(initialCompanyInfo);
    setIsEditing(false);
  };

  if (error) {
    return (
        <div className="container mx-auto py-10">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Failed to Load Profile</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }
  
  if (!companyInfo) {
      return (
        <div className="container mx-auto py-10 text-center">
             <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Profile Not Found</AlertTitle>
                <AlertDescription>No company profile found. Please create one from your dashboard.</AlertDescription>
            </Alert>
        </div>
      )
  }

  return (
    <div className="bg-muted/20 min-h-screen">
      <div className="relative bg-gradient-to-br from-primary/80 to-accent/80 pb-16 pt-24">
         {companyInfo.banner ? (
              <Image
                  src={companyInfo.banner}
                  alt="Company banner"
                  data-ai-hint="abstract technology"
                  fill
                  className="object-cover absolute inset-0 z-0"
              />
          ) : (
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 z-0"></div>
          )}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-0"></div>
      </div>
      
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <Card className="w-full -mt-16 z-10 relative shadow-xl">
           <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-background border-4 border-background shadow-md flex items-center justify-center shrink-0 p-2">
                    {companyInfo.logo ? (
                      <Image src={companyInfo.logo} alt="Company Logo" width={128} height={128} className="h-full w-full rounded-full object-contain" />
                    ) : (
                      <Icons.logo className="h-20 w-20 text-primary" />
                    )}
                </div>
                <div className="flex-grow text-center md:text-left">
                     <h1 className="text-3xl font-bold font-headline text-foreground">{companyInfo.company_name}</h1>
                     <p className="text-muted-foreground mt-1">{companyInfo.designation}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {!isEditing && (
                      <>
                        <Button className="transition-transform hover:scale-105">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Follow
                        </Button>
                        {companyInfo.user_permissions.can_edit_profile && (
                            <Button variant="outline" onClick={() => setIsEditing(true)} className="transition-transform hover:scale-105">
                                <FilePenLine className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        )}
                      </>
                    )}
                </div>
           </CardContent>
        </Card>
        
        {isEditing ? (
            <Card>
                <CardHeader>
                    <CardTitle>Edit Company Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Company Name</Label>
                            <Input id="company_name" name="company_name" value={companyInfo.company_name} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Company Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={companyInfo.description}
                                onChange={handleInputChange}
                                className="text-base leading-relaxed min-h-[150px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Company Website</Label>
                            <Input id="website" name="website" value={companyInfo.website} onChange={handleInputChange} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="logo">Company Logo (update)</Label>
                                <Input id="logo" name="logo" type="file" accept="image/*" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="banner">Company Banner (update)</Label>
                                <Input id="banner" name="banner" type="file" accept="image/*" />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" type="button" onClick={handleCancel} disabled={isSaving}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        ) : (
            <div>
                 <Tabs defaultValue="about" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto sticky top-2 z-20">
                        <TabsTrigger value="about" className="hover:bg-muted/80 data-[state=active]:underline">About Us</TabsTrigger>
                        <TabsTrigger value="careers" className="hover:bg-muted/80 data-[state=active]:underline">Careers ({initialJobs.length})</TabsTrigger>
                        <TabsTrigger value="news" className="hover:bg-muted/80 data-[state=active]:underline">News ({initialNewsPosts.length})</TabsTrigger>
                    </TabsList>

                    <div className="mt-8 space-y-8">
                        <TabsContent value="about">
                           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                               <div className="lg:col-span-2 bg-card p-6 rounded-lg border">
                                   <h2 className="text-2xl font-bold font-headline mb-4">About {companyInfo.company_name}</h2>
                                   <Separator className="mb-6"/>
                                    <div className="prose prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {companyInfo.description}
                                    </div>
                               </div>
                               <div className="space-y-6">
                                   <Card className="bg-card border">
                                       <CardHeader>
                                           <CardTitle className="font-headline text-lg">Quick Stats</CardTitle>
                                       </CardHeader>
                                       <CardContent className="space-y-4 text-sm">
                                           <div className="flex justify-between items-center gap-4">
                                               <span className="text-muted-foreground flex items-center gap-2"><Building /> Active Jobs</span>
                                               <span className="font-bold text-lg">{companyInfo.company_stats.active_jobs}</span>
                                           </div>
                                            <div className="flex justify-between items-center gap-4">
                                               <span className="text-muted-foreground flex items-center gap-2"><Activity /> Total Applications</span>
                                               <span className="font-bold text-lg">{companyInfo.total_applications_count}</span>
                                           </div>
                                           <div className="flex justify-between items-center gap-4">
                                               <span className="text-muted-foreground flex items-center gap-2"><Users /> Followers</span>
                                               <span className="font-bold text-lg">{companyInfo.followers_count}</span>
                                           </div>
                                       </CardContent>
                                   </Card>
                                    <Button asChild className="w-full">
                                        <a href={companyInfo.website} target="_blank" rel="noreferrer noopener">
                                            Visit Website <ArrowRight className="ml-2 w-4 h-4"/>
                                        </a>
                                    </Button>
                               </div>
                           </div>
                        </TabsContent>

                        <TabsContent value="careers">
                             <h2 className="text-2xl font-bold font-headline mb-6 text-center">Open Positions</h2>
                            {initialJobs.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {initialJobs.map(job => (
                                        <Card key={job.id} className="flex flex-col hover:border-primary/50 hover:shadow-lg transition-all bg-card">
                                            <CardHeader>
                                                <CardTitle className="font-headline text-lg">{job.title}</CardTitle>
                                                <CardDescription className="flex items-center gap-2 pt-1 text-sm">
                                                    <MapPin className="w-4 h-4" /> {job.location}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-1">
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="secondary">{job.experienceLevel}</Badge>
                                                    <Badge variant="secondary">{job.employmentType}</Badge>
                                                    <Badge variant="secondary">{job.workingMode}</Badge>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                <Button asChild className="w-full">
                                                    <Link href={`/jobs/${job.id}`}>View Details <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
                                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">No Open Positions</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        There are no active job openings at the moment. Follow us for future updates!
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="news">
                            <h2 className="text-2xl font-bold font-headline mb-6 text-center">What's Happening at {companyInfo.company_name}</h2>
                            {initialNewsPosts.length > 0 ? (
                                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                    {initialNewsPosts.map(post => (
                                        <Card key={post.id} className="overflow-hidden group bg-card">
                                            {post.image && (
                                                <div className="relative w-full aspect-video overflow-hidden">
                                                    <Image
                                                        src={post.image}
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
                                                <CardDescription>{format(new Date(post.created_at), "PPP")}</CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                 <div className="text-center py-16 border-2 border-dashed rounded-lg bg-card">
                                    <Rss className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">No News Yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        There are no company news or announcements at the moment.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        )}
      </main>
    </div>
  );
}

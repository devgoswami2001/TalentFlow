

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { jobs, newsPosts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
    Briefcase, 
    MapPin, 
    ArrowRight, 
    Rss, 
    Building, 
    Camera, 
    UserPlus, 
    FilePenLine,
    Save,
    X,
    Trash2,
    PlusCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const logoDataUri = "data:image/png;base64,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";

const initialCompanyInfo = {
  name: 'Hyresense',
  tagline: 'Pioneering the Future of Talent Acquisition',
  description: 'Hyresense is at the forefront of revolutionizing the recruitment industry. We leverage cutting-edge AI and data analytics to create intelligent, intuitive, and efficient hiring solutions. Our mission is to connect exceptional talent with innovative companies, fostering growth and success for both.',
  longDescription: 'Founded on the principle that people are a company\'s greatest asset, Hyresense was built to bridge the gap between technology and human potential. Our platform streamlines the entire hiring pipeline, from job posting and applicant tracking to AI-powered resume analysis and collaborative team tools. We are committed to building a future where recruitment is not just a process, but a strategic advantage.',
  bannerUrl: 'https://placehold.co/1200x400',
  logoUrl: logoDataUri,
  gallery: {
    images: [
      { src: 'https://placehold.co/800x600', alt: 'Modern office interior', hint: 'modern office' },
      { src: 'https://placehold.co/800x600', alt: 'Team collaborating on a project', hint: 'team collaboration' },
      { src: 'https://placehold.co/800x600', alt: 'Company event', hint: 'company event' },
      { src: 'https://placehold.co/800x600', alt: 'Close-up of our technology dashboard', hint: 'dashboard interface' },
    ]
  }
};

const activeJobs = jobs.filter(job => job.status === 'Active').slice(0, 3);
const latestNews = newsPosts.filter(post => post.visibility === 'Public').slice(0, 2);

export function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleGalleryImageChange = (index: number, field: 'src' | 'alt' | 'hint', value: string) => {
    setCompanyInfo(prev => {
        const newImages = [...prev.gallery.images];
        newImages[index] = { ...newImages[index], [field]: value };
        return {
            ...prev,
            gallery: {
                ...prev.gallery,
                images: newImages,
            },
        };
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setCompanyInfo(prev => ({
        ...prev,
        gallery: {
            ...prev.gallery,
            images: prev.gallery.images.filter((_, i) => i !== index),
        },
    }));
  };

  const handleAddGalleryImage = () => {
    setCompanyInfo(prev => ({
        ...prev,
        gallery: {
            ...prev.gallery,
            images: [
                ...prev.gallery.images,
                { src: 'https://placehold.co/800x600', alt: 'New image alt text', hint: 'new image' },
            ],
        },
    }));
  };

  const handleSave = () => {
    // In a real app, this would trigger an API call to save the data.
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCompanyInfo(initialCompanyInfo); // Reset changes
    setIsEditing(false);
  };

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="absolute inset-0 -z-10 h-1/3 bg-gradient-to-b from-primary/20 to-transparent"></div>
      
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Card className="w-full shadow-2xl shadow-primary/10 border-primary/20 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-primary/80 to-accent/80 relative">
             <Image
                src={companyInfo.bannerUrl}
                alt="Company banner"
                data-ai-hint="abstract technology"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-end p-6">
                <div className="flex items-end gap-4 w-full">
                    <div className="w-28 h-28 rounded-full bg-background border-4 border-background shadow-lg flex items-center justify-center shrink-0">
                        {companyInfo.logoUrl.startsWith('data:image') ? (
                          <Image src={companyInfo.logoUrl} alt="Company Logo" width={64} height={64} className="h-16 w-16" />
                        ) : (
                          <Icons.logo className="h-16 w-16 text-primary" />
                        )}
                    </div>
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="space-y-1">
                                <Input
                                    name="name"
                                    value={companyInfo.name}
                                    onChange={handleInputChange}
                                    className="text-4xl h-auto p-0 border-0 bg-transparent font-bold font-headline text-primary-foreground shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                                <Input
                                    name="tagline"
                                    value={companyInfo.tagline}
                                    onChange={handleInputChange}
                                    className="text-primary-foreground/90 h-auto p-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-4xl font-bold font-headline text-primary-foreground shadow-sm">{companyInfo.name}</h1>
                                <p className="text-primary-foreground/90 mt-1">{companyInfo.tagline}</p>
                            </div>
                        )}
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
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="mr-2 h-4 w-4" />
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Follow
                            </Button>
                            <Button variant="outline" onClick={() => setIsEditing(true)}>
                                <FilePenLine className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <CardContent className="p-0">
                <TabsContent value="about" className="p-6 mt-0 space-y-8">
                    {isEditing && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <Label htmlFor="bannerUrl">Banner Image URL</Label>
                                <Input id="bannerUrl" name="bannerUrl" value={companyInfo.bannerUrl} onChange={handleInputChange} />
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="logoUrl">Logo Image URL</Label>
                                <Input id="logoUrl" name="logoUrl" value={companyInfo.logoUrl} onChange={handleInputChange} />
                             </div>
                        </div>
                    )}
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-headline">Innovating Recruitment</h2>
                      {isEditing ? (
                          <Textarea
                              name="longDescription"
                              value={companyInfo.longDescription}
                              onChange={handleInputChange}
                              className="text-muted-foreground leading-relaxed min-h-[150px] mt-4"
                          />
                      ) : (
                          <p className="text-muted-foreground leading-relaxed mt-4">{companyInfo.longDescription}</p>
                      )}
                    </div>
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
                     {isEditing ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {companyInfo.gallery.images.map((image, index) => (
                                    <Card key={index} className="p-4 space-y-2 relative">
                                        <div className="space-y-1">
                                            <Label htmlFor={`img-src-${index}`}>Image URL</Label>
                                            <Input id={`img-src-${index}`} value={image.src} onChange={(e) => handleGalleryImageChange(index, 'src', e.target.value)} />
                                        </div>
                                         <div className="space-y-1">
                                            <Label htmlFor={`img-alt-${index}`}>Alt Text</Label>
                                            <Input id={`img-alt-${index}`} value={image.alt} onChange={(e) => handleGalleryImageChange(index, 'alt', e.target.value)} />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 h-7 w-7"
                                            onClick={() => handleRemoveGalleryImage(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove Image</span>
                                        </Button>
                                    </Card>
                                ))}
                            </div>
                            <Button variant="outline" onClick={handleAddGalleryImage}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Image
                            </Button>
                        </div>
                     ) : (
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
                     )}
                </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}

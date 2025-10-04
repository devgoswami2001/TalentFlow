
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { CompanyProfile, Job, NewsPost, LeadershipMember } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
    Users,
    Linkedin,
    PlusCircle,
    User,
    Award,
    BookText,
    Edit,
    Trash2,
    ThumbsUp,
    MessageSquare,
    Globe,
    Users as UsersIcon,
    Link as LinkIcon,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateCompanyProfile, createLeadershipMember, updateLeadershipMember, deleteLeadershipMember } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription as UiAlertDescription, AlertTitle } from './ui/alert';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type CompanyProfilePageProps = {
    initialCompanyInfo: CompanyProfile | null;
    initialNewsPosts: NewsPost[];
    initialJobs: Job[];
    error: string | null;
};

const leadershipFormSchema = z.object({
    name: z.string().min(2, "Name is required."),
    position: z.string().min(2, "Position is required."),
    bio: z.string().min(10, "Bio must be at least 10 characters.").optional(),
    linkedin: z.string().url("Please enter a valid LinkedIn URL.").optional().or(z.literal('')),
    photo: z.any().optional(),
});

type LeadershipFormValues = z.infer<typeof leadershipFormSchema>;

const LeadershipFormDialog = ({
    open,
    onOpenChange,
    onSuccess,
    editingMember,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (updatedMember: LeadershipMember) => void;
    editingMember: LeadershipMember | null;
}) => {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<LeadershipFormValues>({
        resolver: zodResolver(leadershipFormSchema),
    });

    React.useEffect(() => {
        if (editingMember) {
            form.reset({
                name: editingMember.name,
                position: editingMember.position,
                bio: editingMember.bio,
                linkedin: editingMember.linkedin,
                photo: undefined,
            });
        } else {
            form.reset({
                name: "",
                position: "",
                bio: "",
                linkedin: "",
                photo: undefined,
            });
        }
    }, [editingMember, form]);

    const onSubmit = async (values: LeadershipFormValues) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('position', values.position);
        formData.append('bio', values.bio || '');
        formData.append('linkedin', values.linkedin || '');
        if (values.photo && values.photo[0]) {
            formData.append('photo', values.photo[0]);
        }

        const result = editingMember
            ? await updateLeadershipMember(editingMember.id, formData)
            : await createLeadershipMember(formData);

        if (result.success && result.data) {
            toast({
                title: editingMember ? "Member Updated" : "Member Added",
                description: `${values.name} has been ${editingMember ? 'updated' : 'added'}.`,
            });
            onSuccess(result.data);
            onOpenChange(false);
        } else {
            const errorMsg = result.errors ? Object.values(result.errors).flat().join(' ') : result.message;
            toast({
                variant: "destructive",
                title: editingMember ? "Update Failed" : "Failed to Add Member",
                description: errorMsg || "An unknown error occurred.",
            });
        }
        setIsSubmitting(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingMember ? 'Edit' : 'Add'} Leadership Member</DialogTitle>
                    <DialogDescription>Fill in the details for the team member.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <FormControl><Input placeholder="e.g. John Doe" {...field} className="pl-9" /></FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="position"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <div className="relative">
                                        <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <FormControl><Input placeholder="e.g. CEO, CTO" {...field} className="pl-9" /></FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <div className="relative">
                                        <BookText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <FormControl><Textarea placeholder="A short bio about the member..." {...field} className="pl-9" /></FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="linkedin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>LinkedIn URL</FormLabel>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <FormControl><Input placeholder="https://linkedin.com/in/..." {...field} className="pl-9" /></FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="photo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Photo</FormLabel>
                                    <FormDescription>{editingMember ? "Leave blank to keep the current photo." : "Upload a photo."}</FormDescription>
                                    <FormControl>
                                        <Input type="file" accept="image/*" onChange={(e) => field.onChange(e.target.files)} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingMember ? 'Save Changes' : 'Add Member'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export function CompanyProfilePage({ initialCompanyInfo, initialNewsPosts, initialJobs, error }: CompanyProfilePageProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLeadershipFormOpen, setIsLeadershipFormOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<LeadershipMember | null>(null);
    const [deletingMember, setDeletingMember] = useState<LeadershipMember | null>(null);
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

        const rawFormData = new FormData(e.currentTarget);
        const formData = new FormData();

        // copy only non-empty fields
        rawFormData.forEach((value, key) => {
            if (value instanceof File) {
                if (value.size > 0) {   // ✅ sirf tabhi bhejo jab file select ki ho
                    formData.append(key, value);
                }
            } else if (value !== "") {
                formData.append(key, value as string);
            }
        });

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

    const handleLeadershipSuccess = (updatedMember: LeadershipMember) => {
        setCompanyInfo(prev => {
            if (!prev) return null;
            const existing = prev.leadership_team.find(m => m.id === updatedMember.id);
            if (existing) {
                return {
                    ...prev,
                    leadership_team: prev.leadership_team.map(m => m.id === updatedMember.id ? updatedMember : m)
                };
            } else {
                return {
                    ...prev,
                    leadership_team: [...prev.leadership_team, updatedMember]
                };
            }
        });
    };

    const handleEditMember = (member: LeadershipMember) => {
        setEditingMember(member);
        setIsLeadershipFormOpen(true);
    };

    const handleAddMember = () => {
        setEditingMember(null);
        setIsLeadershipFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingMember) return;
        const result = await deleteLeadershipMember(deletingMember.id);
        if (result.success) {
            setCompanyInfo(prev => prev ? ({
                ...prev,
                leadership_team: prev.leadership_team.filter(m => m.id !== deletingMember.id)
            }) : null);
            toast({
                title: "Member Deleted",
                description: `${deletingMember.name} has been removed from the team.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Deletion Failed",
                description: result.message || "An unknown error occurred.",
            });
        }
        setDeletingMember(null);
    };

    if (error) {
        return (
            <div className="container mx-auto py-10">
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Failed to Load Profile</AlertTitle>
                    <UiAlertDescription>{error}</UiAlertDescription>
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
                    <UiAlertDescription>No company profile found. Please create one from your dashboard.</UiAlertDescription>
                </Alert>
            </div>
        );
    }

    const leadershipTeam = companyInfo.leadership_team || [];

    return (
        <>
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

                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {!isEditing && (
                                    <>
                                        <Button className="transition-transform hover:scale-105">
                                            <UserPlus className="mr-2 h-4 w-4" />
                                            Follow
                                        </Button>
                                        {companyInfo.user_permissions?.can_edit_profile && (
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
                                            <div className="lg:col-span-2 space-y-8">
                                                <div className="bg-card p-6 rounded-lg border">
                                                    <h2 className="text-2xl font-bold font-headline mb-4">About {companyInfo.company_name}</h2>
                                                    <Separator className="mb-6" />
                                                    <div className="prose prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                        {companyInfo.description}
                                                    </div>
                                                </div>

                                                <div className="bg-card p-6 rounded-lg border">
                                                    <div className="flex justify-between items-center mb-4">
                                                        <h2 className="text-2xl font-bold font-headline">Meet Our Leadership</h2>
                                                        {companyInfo.user_permissions.can_edit_profile && (
                                                            <Button variant="outline" size="sm" onClick={handleAddMember}>
                                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                                Add Member
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <Separator className="mb-6" />
                                                    {leadershipTeam.length > 0 ? (
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {leadershipTeam.map((member) => (
                                                                <Card key={member.id} className="text-center border-0 shadow-none relative group">
                                                                    {companyInfo.user_permissions.can_edit_profile && (
                                                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditMember(member)}>
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeletingMember(member)}>
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                    <CardContent className="p-0">
                                                                        {member.photo_url && (
                                                                            <Image
                                                                                src={member.photo_url}
                                                                                alt={`Photo of ${member.name}`}
                                                                                width={400}
                                                                                height={400}
                                                                                data-ai-hint="person portrait"
                                                                                className="rounded-full w-32 h-32 mx-auto object-cover border-4 border-primary/20 shadow-md"
                                                                            />
                                                                        )}
                                                                        <h3 className="font-headline text-lg mt-4">{member.name}</h3>
                                                                        <p className="text-primary text-sm font-medium">{member.position}</p>
                                                                        <p className="text-xs text-muted-foreground mt-2 line-clamp-3 h-[45px]">{member.bio}</p>
                                                                    </CardContent>
                                                                    <CardFooter className="justify-center pt-4">
                                                                        {member.linkedin && (
                                                                            <Button variant="ghost" size="icon" asChild>
                                                                                <Link href={member.linkedin} target="_blank">
                                                                                    <Linkedin className="w-5 h-5" />
                                                                                </Link>
                                                                            </Button>
                                                                        )}
                                                                    </CardFooter>
                                                                </Card>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-10 text-muted-foreground">
                                                            <p>Leadership team information is not yet available.</p>
                                                        </div>
                                                    )}
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
                                                        Visit Website <ArrowRight className="ml-2 w-4 h-4" />
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
                                            <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
                                                {initialNewsPosts.map((post) => (
                                                    <Card key={post.id} className="overflow-hidden flex flex-col">
                                                        <CardHeader className="flex flex-row items-center gap-4">
                                                            <Avatar>
                                                                {post.author_avatar && <AvatarImage src={post.author_avatar} alt={post.company_name} data-ai-hint="company logo" />}
                                                                <AvatarFallback>{post.company_name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex-1">
                                                                <p className="font-semibold">{post.company_name}</p>
                                                                <p className="text-xs text-muted-foreground flex items-center gap-2">
                                                                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                                                                    {post.visibility && (
                                                                        <span className="inline-flex items-center gap-1">
                                                                            {post.visibility.toLowerCase() === 'public' ? <Globe className="h-3 w-3" /> : <UsersIcon className="h-3 w-3" />}
                                                                        </span>
                                                                    )}
                                                                </p>
                                                            </div>
                                                        </CardHeader>

                                                        <CardContent className="space-y-4">
                                                            <p className="font-semibold">{post.title}</p>
                                                            <p className="whitespace-pre-wrap text-sm text-muted-foreground">{post.content}</p>
                                                            {post.external_link && (
                                                                <Button asChild variant="secondary" size="sm" className="w-fit">
                                                                    <a href={post.external_link} target="_blank" rel="noreferrer noopener">
                                                                        <LinkIcon className="mr-2 h-4 w-4" /> Read more
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </CardContent>

                                                        {post.image && (
                                                            <div className="relative w-full aspect-video bg-muted">
                                                                <Image
                                                                    src={post.image}
                                                                    alt={post.title}
                                                                    fill
                                                                    className="w-full object-contain"
                                                                    data-ai-hint="announcement news"
                                                                />
                                                            </div>
                                                        )}

                                                        {post.video_url && (
                                                            <div className="w-full aspect-video bg-black">
                                                                <iframe
                                                                    src={post.video_url}
                                                                    title={post.title}
                                                                    className="w-full h-full"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                    referrerPolicy="strict-origin-when-cross-origin"
                                                                    allowFullScreen
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="p-4 space-y-4">
                                                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                                                <div className="flex items-center gap-1.5">
                                                                    <ThumbsUp className="h-4 w-4" />
                                                                    <span>{post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
                                                                </div>
                                                                <span>{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
                                                            </div>

                                                            <Separator />

                                                            <div className="grid grid-cols-3 gap-2">
                                                                <Button variant="ghost" className="text-muted-foreground">
                                                                    <ThumbsUp className="mr-2 h-4 w-4" /> Like
                                                                </Button>
                                                                <Button variant="ghost" className="text-muted-foreground">
                                                                    <MessageSquare className="mr-2 h-4 w-4" /> Comment
                                                                </Button>
                                                                <Button variant="ghost" className="text-muted-foreground">
                                                                    <LinkIcon className="mr-2 h-4 w-4" /> Share
                                                                </Button>
                                                            </div>

                                                            <Separator />

                                                            <div className="space-y-3">
                                                                {post.comments && post.comments.slice(0, 2).map(comment => (
                                                                    <div key={comment.id} className="flex gap-3">
                                                                        <Avatar className="h-8 w-8">
                                                                            <AvatarFallback>{comment.user_email[0].toUpperCase()}</AvatarFallback>
                                                                        </Avatar>
                                                                        <div className="text-sm bg-muted p-3 rounded-lg flex-1">
                                                                            <div className="flex justify-between items-baseline">
                                                                                <p className="font-semibold">{comment.user_email}</p>
                                                                                <p className="text-xs text-muted-foreground">
                                                                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                                                                </p>
                                                                            </div>
                                                                            <p className="mt-1">{comment.comment}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                                {post.comments_count > 2 && (
                                                                    <Button variant="link" size="sm" className="text-muted-foreground">View all {post.comments_count} comments</Button>
                                                                )}
                                                            </div>
                                                        </div>
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

            <LeadershipFormDialog
                open={isLeadershipFormOpen}
                onOpenChange={setIsLeadershipFormOpen}
                onSuccess={handleLeadershipSuccess}
                editingMember={editingMember}
            />

            <AlertDialog open={!!deletingMember} onOpenChange={() => setDeletingMember(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <span className="font-bold">{deletingMember?.name}</span> from the leadership team. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}


"use client";
import Image from 'next/image';
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Link as LinkIcon, Briefcase, FileText, Image as ImageIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const profileFormSchema = z.object({
  company_name: z.string().min(2, "Company name must be at least 2 characters."),
  designation: z.string().min(2, "Designation is required."),
  description: z.string().min(10, "A brief description is required."),
  website: z.string().url("Please enter a valid website URL."),
  logo: z.any().refine(files => files?.length == 1, "Logo is required.").refine(files => files?.[0]?.size <= 5000000, `Max file size is 5MB.`).refine(
    files => ["image/jpeg", "image/png", "image/webp"].includes(files?.[0]?.type),
    ".jpg, .png, and .webp files are accepted."
  ),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function CreateEmployerProfile() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

   const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    const accessToken = getCookie('accessToken');

    if (!accessToken) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'Your session has expired. Please log in again.' });
        router.push('/');
        return;
    }

    const formData = new FormData();
    formData.append('company_name', data.company_name);
    formData.append('designation', data.designation);
    formData.append('description', data.description);
    formData.append('website', data.website);
    formData.append('logo', data.logo[0]);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/profile/create/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Profile creation error:", errorData);
        throw new Error(errorData.detail || "Failed to create profile. Please check the details and try again.");
      }
      
      toast({
          title: "Profile Created Successfully!",
          description: "Welcome to Hyresense! Redirecting you to the dashboard.",
      });

      router.push('/dashboard');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Profile Creation Failed',
        description: error.message,
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl shadow-2xl shadow-primary/20 backdrop-blur-xl border-primary/30 bg-background/50">
      <CardHeader>
        <div className="flex items-center justify-center gap-3 mb-4 group">
          <Image src="/logo.png" alt="HyreSense Logo" width={60} height={45} className="transition-transform group-hover:scale-105 duration-300" />
          <h1 className="text-4xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-shine [background-size:200%_auto]">hyreSENSE</h1>
        </div>
        <CardTitle className="text-center font-headline text-2xl">Create Your Company Profile</CardTitle>
        <CardDescription className="text-center">
          Tell us a bit about your company to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="company_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                   <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="Your Company Inc." {...field} className="pl-9 bg-transparent focus:bg-background/80" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Designation</FormLabel>
                   <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input placeholder="e.g., HR Manager, Founder" {...field} className="pl-9 bg-transparent focus:bg-background/80" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Website</FormLabel>
                   <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Input type="url" placeholder="https://yourcompany.com" {...field} className="pl-9 bg-transparent focus:bg-background/80" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                   <div className="relative">
                     <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <Textarea placeholder="What does your company do?" {...field} className="pl-9 bg-transparent focus:bg-background/80 min-h-[100px]" />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                        <Input
                            type="file"
                            accept="image/png, image/jpeg, image/webp"
                            className="pl-9 file:text-primary file:font-semibold"
                            onChange={(e) => field.onChange(e.target.files)}
                         />
                    </FormControl>
                   </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Profile...' : 'Complete Profile & Continue'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

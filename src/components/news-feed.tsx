
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { PlusCircle, Globe, Users, Link as LinkIcon, Trash2, FilePenLine } from "lucide-react";
import { newsPosts as initialNewsPosts, type NewsPost } from "@/lib/data";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const newsPostFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  videoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  externalLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  category: z.enum(["Hiring Announcements", "Company Culture", "Industry News", "Job Fairs / Events"]),
  visibility: z.enum(["Public", "Internal"]),
});

type NewsPostFormValues = z.infer<typeof newsPostFormSchema>;

export function NewsFeed() {
  const [posts, setPosts] = React.useState<NewsPost[]>(initialNewsPosts);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<NewsPost | null>(null);

  const form = useForm<NewsPostFormValues>({
    resolver: zodResolver(newsPostFormSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      videoUrl: "",
      externalLink: "",
      category: "Hiring Announcements",
      visibility: "Public",
    },
  });

  const handleOpenFormDialog = (post: NewsPost | null) => {
    setSelectedPost(post);
    if (post) {
        form.reset({
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl || "",
            videoUrl: post.videoUrl || "",
            externalLink: post.externalLink || "",
            category: post.category,
            visibility: post.visibility,
        });
    } else {
        form.reset();
    }
    setIsFormOpen(true);
  };

  const onSubmit = (data: NewsPostFormValues) => {
    if (selectedPost) {
      // Edit post
      setPosts(posts.map(p => p.id === selectedPost.id ? {
          ...p,
          ...data,
          timestamp: new Date().toISOString()
      } : p));
    } else {
      // Add new post
      const newPost: NewsPost = {
        id: Math.max(...posts.map(p => p.id), 0) + 1,
        ...data,
        author: "Admin User", // Assuming logged in user
        timestamp: new Date().toISOString(),
      };
      setPosts([newPost, ...posts]);
    }
    form.reset();
    setSelectedPost(null);
    setIsFormOpen(false);
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };
  
  const NewsPostFormDialog = () => (
    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{selectedPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>
              {selectedPost ? 'Update the details of your news post.' : 'Share updates with your team and the public.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. We're hiring a new Designer!" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Share the details here..." className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                     <FormDescription>Provide a link to a video (e.g., YouTube, Vimeo).</FormDescription>
                    <FormControl>
                      <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="externalLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>External Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourcompany.com/blog/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Hiring Announcements">Hiring Announcements</SelectItem>
                            <SelectItem value="Company Culture">Company Culture</SelectItem>
                            <SelectItem value="Industry News">Industry News</SelectItem>
                            <SelectItem value="Job Fairs / Events">Job Fairs / Events</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Visibility</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select visibility" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Public">Public</SelectItem>
                            <SelectItem value="Internal">Internal (Team-only)</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
                <Button type="submit">Save Post</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">News Feed</CardTitle>
              <CardDescription>
                Manage your company news and hiring updates.
              </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenFormDialog(null)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create Post
                </span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {posts.length > 0 ? posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
                {post.imageUrl && (
                    <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={800}
                        height={400}
                        className="w-full object-cover aspect-video"
                        data-ai-hint="announcement news"
                    />
                )}
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                           <Badge variant="secondary">{post.category}</Badge>
                           <Badge variant={post.visibility === 'Public' ? 'outline' : 'default'} className="flex items-center gap-1">
                             {post.visibility === 'Public' ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                             {post.visibility}
                           </Badge>
                        </div>
                        <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                         <Button variant="ghost" size="icon" onClick={() => handleOpenFormDialog(post)}>
                            <FilePenLine className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                         </Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this news post.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePost(post.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                         </AlertDialog>
                    </div>
                </div>
                 <CardDescription>
                    By {post.author} on {format(new Date(post.timestamp), "MMMM d, yyyy")}
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{post.content}</p>
                {post.videoUrl && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Watch Video:</h4>
                        <Link href={post.videoUrl} target="_blank" className="text-primary hover:underline break-all">{post.videoUrl}</Link>
                    </div>
                )}
              </CardContent>
              {post.externalLink && (
                 <>
                    <Separator className="my-4"/>
                    <CardFooter>
                        <Link href={post.externalLink} target="_blank" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Read More
                        </Link>
                    </CardFooter>
                </>
              )}
            </Card>
          )) : (
            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                <CardTitle>No News Yet</CardTitle>
                <CardDescription className="mt-2">Click "Create Post" to share your first update.</CardDescription>
            </div>
          )}
        </CardContent>
      </Card>
      <NewsPostFormDialog />
    </>
  );
}

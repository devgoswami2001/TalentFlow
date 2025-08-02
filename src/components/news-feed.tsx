
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { PlusCircle, Globe, Users, Link as LinkIcon, Trash2, FilePenLine, Loader2, AlertTriangle } from "lucide-react";
import type { NewsPost } from "@/lib/data";
import { createOrUpdateNewsPost, deleteNewsPost, getNewsPosts } from "@/lib/actions";

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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";


const newsPostFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(10, { message: "Content must be at least 10 characters." }),
  image: z.any().optional(),
  video_url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  external_link: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  category: z.enum(["Hiring Announcements", "Company Culture", "Industry News", "Job Fairs / Events"]),
  visibility: z.enum(["public", "internal"]),
});

type NewsPostFormValues = z.infer<typeof newsPostFormSchema>;


const NewsPostFormDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  form,
  editingPost
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: NewsPostFormValues) => void;
  isSubmitting: boolean;
  form: any;
  editingPost: NewsPost | null;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(editingPost?.image || null);
  
  React.useEffect(() => {
    setImagePreview(editingPost?.image || null);
  }, [editingPost]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the details for your post.' : 'Share updates with your team and the public.'}
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
                  name="image"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormDescription>{editingPost ? 'Upload a new image to replace the current one.' : 'Optionally, upload an image for the news post.'}</FormDescription>
                      <FormControl>
                          <Input 
                            type="file" 
                            accept="image/png, image/jpeg, image/gif, image/webp"
                            ref={fileInputRef}
                            onChange={(e) => {
                                onChange(e.target.files);
                                if (e.target.files && e.target.files[0]) {
                                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                                } else {
                                    setImagePreview(editingPost?.image || null);
                                }
                            }}
                            {...rest}
                          />
                      </FormControl>
                       <FormMessage />
                      {imagePreview && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Image Preview</p>
                          <div className="relative w-48 h-28">
                             <Image
                                src={imagePreview}
                                alt="Post image preview"
                                fill
                                className="rounded-md object-cover"
                                data-ai-hint="company announcement"
                              />
                          </div>
                           <Button
                              type="button"
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-destructive hover:text-destructive"
                              onClick={() => {
                                  onChange(null);
                                  setImagePreview(null);
                                  if (fileInputRef.current) {
                                      fileInputRef.current.value = "";
                                  }
                              }}
                          >
                              Remove Image
                          </Button>
                        </div>
                      )}
                    </FormItem>
                  )}
              />
               <FormField
                control={form.control}
                name="video_url"
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
                name="external_link"
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
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="internal">Internal (Team-only)</SelectItem>
                        </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {isSubmitting ? "Saving..." : (editingPost ? "Save Changes" : "Save Post")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}


export function NewsFeed() {
  const [posts, setPosts] = React.useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<NewsPost | null>(null);
  const { toast } = useToast();

  const form = useForm<NewsPostFormValues>({
    resolver: zodResolver(newsPostFormSchema),
  });

  React.useEffect(() => {
    const fetchPosts = async () => {
        setIsLoading(true);
        setError(null);
        const result = await getNewsPosts();
        if (result.success && result.data) {
            setPosts(result.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } else {
            setError(result.error || "Failed to load posts.");
        }
        setIsLoading(false);
    }
    fetchPosts();
  }, []);

  const handleOpenFormDialog = (post: NewsPost | null = null) => {
    setEditingPost(post);
    if (post) {
        form.reset({
            title: post.title,
            content: post.content,
            image: null, // Don't pre-fill file input, just show preview
            video_url: post.video_url || "",
            external_link: post.external_link || "",
            category: post.category,
            visibility: post.visibility,
        });
    } else {
        form.reset({
            title: "",
            content: "",
            image: null,
            video_url: "",
            external_link: "",
            category: "Hiring Announcements",
            visibility: "public",
        });
    }
    setIsFormOpen(true);
  };

  const onSubmit = async (data: NewsPostFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'image') {
            if (value instanceof FileList && value.length > 0) {
                formData.append('image', value[0]);
            }
        } else if (value !== null && value !== undefined && value !== "") {
             formData.append(key, value as string);
        }
    });

    const result = await createOrUpdateNewsPost(formData, editingPost?.id || null);
    
    if (result.success && result.data) {
        const newPost = result.data;
        if (editingPost) {
            // Update existing post in the list
            setPosts(prev => prev.map(p => p.id === newPost.id ? newPost : p));
            toast({ title: "Post Updated", description: "Your news post has been updated successfully." });
        } else {
            // Add new post to the list
            setPosts(prev => [newPost, ...prev]);
            toast({ title: "Post Created", description: "Your news post has been saved successfully." });
        }
        setIsFormOpen(false);
        setEditingPost(null);
    } else {
        toast({ variant: "destructive", title: "Submission Failed", description: result.error || "An unknown error occurred." });
    }

    setIsSubmitting(false);
  };

  const handleDeletePost = async (postId: number) => {
    setIsDeleting(true);
    const result = await deleteNewsPost(postId);
    if (result.success) {
        setPosts(posts.filter(p => p.id !== postId));
        toast({ title: "Post Deleted", description: "The news post has been successfully deleted." });
    } else {
        toast({ variant: "destructive", title: "Deletion Failed", description: result.error });
    }
    setIsDeleting(false);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">News Feed</CardTitle>
              <CardDescription>
                Manage your company news and hiring updates.
              </CardDescription>
            </div>
            <Button size="sm" className="h-8 gap-1" onClick={() => handleOpenFormDialog()}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Create Post
                </span>
            </Button>
          </div>
        </CardHeader>
      </Card>
        
        {isLoading ? (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="w-full h-48" />
                        <CardHeader>
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : error ? (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Failed to Load News Feed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {posts.length > 0 ? posts.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col">
                    {post.image && (
                        <div className="relative w-full aspect-video">
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="w-full object-cover"
                                data-ai-hint="announcement news"
                            />
                        </div>
                    )}
                  <div className="flex flex-col flex-1">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                          <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="secondary">{post.category}</Badge>
                                <Badge variant={post.visibility.toLowerCase() === 'public' ? 'outline' : 'default'} className="flex items-center gap-1">
                                  {post.visibility.toLowerCase() === 'public' ? <Globe className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                                  {post.visibility}
                                </Badge>
                              </div>
                              <CardTitle className="font-headline text-xl">{post.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-1">
                               <Button variant="ghost" size="icon" onClick={() => handleOpenFormDialog(post)}>
                                    <FilePenLine className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                </Button>
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" disabled={isDeleting}>
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
                                      <AlertDialogAction onClick={() => handleDeletePost(post.id)} className="bg-red-600 hover:bg-red-700">
                                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Delete
                                      </AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </div>
                      </div>
                      <CardDescription>
                          By {post.company_name} on {format(new Date(post.created_at), "MMMM d, yyyy")}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="whitespace-pre-wrap text-sm">{post.content}</p>
                      {post.video_url && (
                          <div className="mt-4">
                              <h4 className="font-semibold mb-2 text-sm">Watch Video:</h4>
                              <Link href={post.video_url} target="_blank" className="text-primary hover:underline break-all text-sm">{post.video_url}</Link>
                          </div>
                      )}
                    </CardContent>
                    {post.external_link && (
                      <>
                          <Separator className="mt-auto"/>
                          <CardFooter className="pt-6">
                              <Button asChild variant="outline" size="sm">
                                <Link href={post.external_link} target="_blank">
                                    <LinkIcon className="h-4 w-4 mr-2" />
                                    Read More
                                </Link>
                              </Button>
                          </CardFooter>
                      </>
                    )}
                  </div>
                </Card>
              )) : (
                <div className="lg:col-span-2 xl:col-span-3">
                    <Card>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
                                <CardTitle>No News Yet</CardTitle>
                                <CardDescription className="mt-2">Click "Create Post" to share your first update.</CardDescription>
                            </div>
                        </CardContent>
                    </Card>
                </div>
              )}
            </div>
        )}
      <NewsPostFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        form={form}
        editingPost={editingPost}
      />
    </div>
  );
}

    
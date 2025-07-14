
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { TagsInput } from "@/components/ui/tags-input";
import type { Job } from "@/lib/data";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const jobFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(50, "Description must be at least 50 characters."),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required."),
  experienceLevel: z.enum(['Entry-level', 'Mid-level', 'Senior', 'Lead', 'Internship']),
  workingMode: z.enum(['Remote', 'On-site', 'Hybrid']),
  location: z.string().min(2, "Location is required."),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract']),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  applicationDeadline: z.date(),
  screeningQuestions: z.array(z.string()).optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

type JobFormProps = {
  job?: Job | null;
  onSubmit: (values: Job, status: 'Draft' | 'Active') => void;
  onCancel: () => void;
};

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      requiredSkills: job?.requiredSkills || [],
      experienceLevel: job?.experienceLevel || 'Mid-level',
      workingMode: job?.workingMode || 'Remote',
      location: job?.location || "",
      employmentType: job?.employmentType || 'Full-time',
      salaryMin: job?.salaryMin || undefined,
      salaryMax: job?.salaryMax || undefined,
      applicationDeadline: job?.applicationDeadline || new Date(),
      screeningQuestions: job?.screeningQuestions || [],
    },
  });

  const handleSubmit = (status: 'Draft' | 'Active') => (values: JobFormValues) => {
    const newJobData: Job = {
      id: job?.id || Date.now(),
      status,
      datePosted: job?.datePosted || new Date(),
      ...values,
    };
    onSubmit(newJobData, status);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col h-full">
        <ScrollArea className="flex-1 pr-6 -mr-6">
            <div className="space-y-6 p-1">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Employment Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select employment type" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Full-time">Full-time</SelectItem>
                                    <SelectItem value="Part-time">Part-time</SelectItem>
                                    <SelectItem value="Contract">Contract</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="experienceLevel"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Experience Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select experience level" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Internship">Internship</SelectItem>
                                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                                    <SelectItem value="Senior">Senior</SelectItem>
                                    <SelectItem value="Lead">Lead</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="workingMode"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>Working Mode</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="On-site" />
                                </FormControl>
                                <FormLabel className="font-normal">On-site</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Hybrid" />
                                </FormControl>
                                <FormLabel className="font-normal">Hybrid</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="Remote" />
                                </FormControl>
                                <FormLabel className="font-normal">Remote</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. San Francisco, USA" {...field} />
                        </FormControl>
                         <FormDescription>
                            Enter the city and country for this role.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormItem>
                        <FormLabel>Salary Range (Optional)</FormLabel>
                        <div className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name="salaryMin"
                                render={({ field }) => (
                                    <FormControl>
                                        <Input type="number" placeholder="Min" {...field} />
                                    </FormControl>
                                )}
                            />
                            <span>-</span>
                             <FormField
                                control={form.control}
                                name="salaryMax"
                                render={({ field }) => (
                                    <FormControl>
                                        <Input type="number" placeholder="Max" {...field} />
                                    </FormControl>
                                )}
                            />
                        </div>
                    </FormItem>
                     <FormField
                        control={form.control}
                        name="applicationDeadline"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Application Deadline</FormLabel>
                            <FormControl>
                                <DatePicker date={field.value} setDate={field.onChange} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="requiredSkills"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                            <TagsInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Add a skill and press Enter..."
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                 />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Provide a detailed job description..."
                            className="min-h-[150px]"
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="screeningQuestions"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Screening Questions (Optional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Enter one question per line..."
                                className="min-h-[100px]"
                                value={field.value?.join('\n') || ''}
                                onChange={(e) => field.onChange(e.target.value.split('\n'))}
                            />
                        </FormControl>
                        <FormDescription>
                            These questions will be asked to candidates upon application.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </ScrollArea>
        <div className="mt-auto pt-6 -mx-6 px-6 -mb-6 pb-6 bg-background border-t">
             <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="button" variant="outline" onClick={form.handleSubmit(handleSubmit('Draft'))}>
                    Save Draft
                </Button>
                <Button type="button" onClick={form.handleSubmit(handleSubmit('Active'))}>
                    {job?.status === 'Active' ? 'Save Changes' : 'Post Now'}
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}

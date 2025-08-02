
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parseISO } from "date-fns";
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
import { PlusCircle, Trash2 } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const screeningQuestionSchema = z.object({
  question: z.string().min(5, "Question must be at least 5 characters."),
  type: z.enum(['text', 'boolean']),
});

const jobFormSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(50, "Description must be at least 50 characters."),
  requiredSkills: z.array(z.string()).min(1, "At least one skill is required."),
  experienceLevel: z.enum(['Entry-level', 'Mid-level', 'Senior-level', 'Lead', 'Internship']),
  workingMode: z.enum(['Remote', 'On-site', 'Hybrid']),
  location: z.string().min(2, "Location is required."),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract']),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  applicationDeadline: z.date(),
  screeningQuestions: z.array(screeningQuestionSchema).optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

type JobFormProps = {
  job?: Job | null;
  onSubmit: (values: Partial<Job>, status: 'Draft' | 'Active') => Promise<void>;
  onCancel: () => void;
};

export function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      id: job?.id,
      title: job?.title || "",
      description: job?.description || "",
      requiredSkills: job?.requiredSkills || [],
      experienceLevel: job?.experienceLevel || 'Mid-level',
      workingMode: job?.workingMode || 'Remote',
      location: job?.location || "",
      employmentType: job?.employmentType || 'Full-time',
      salaryMin: job?.salaryMin ?? undefined,
      salaryMax: job?.salaryMax ?? undefined,
      applicationDeadline: job?.applicationDeadline ? (typeof job.applicationDeadline === 'string' ? parseISO(job.applicationDeadline) : job.applicationDeadline) : new Date(),
      screeningQuestions: job?.screeningQuestions || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "screeningQuestions",
  });

  const handleFormSubmit = async (status: 'Active') => {
    const isValid = await form.trigger();
    if (isValid) {
      setIsSubmitting(true);
      await onSubmit(form.getValues(), status);
      setIsSubmitting(false);
    }
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
                                    <SelectItem value="Senior-level">Senior-level</SelectItem>
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
                                        <Input type="number" placeholder="Min" {...field} value={field.value ?? ''} />
                                    </FormControl>
                                )}
                            />
                            <span>-</span>
                             <FormField
                                control={form.control}
                                name="salaryMax"
                                render={({ field }) => (
                                    <FormControl>
                                        <Input type="number" placeholder="Max" {...field} value={field.value ?? ''} />
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
                
                <div>
                  <FormLabel>Screening Questions (Optional)</FormLabel>
                  <FormDescription className="mb-2">
                      These questions will be asked to candidates upon application.
                  </FormDescription>
                  <div className="space-y-4">
                    {fields.map((item, index) => (
                      <Card key={item.id} className="p-4 relative">
                        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-3 gap-4">
                           <FormField
                              control={form.control}
                              name={`screeningQuestions.${index}.question`}
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Question</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g., How many years of experience...?" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`screeningQuestions.${index}.type`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="text">Text</SelectItem>
                                      <SelectItem value="boolean">Yes/No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </CardContent>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove question</span>
                          </Button>
                      </Card>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ question: '', type: 'text' })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>
                </div>
            </div>
        </ScrollArea>
        <div className="mt-auto pt-6 -mx-6 px-6 -mb-6 pb-6 bg-background border-t">
             <div className="flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="button" onClick={() => handleFormSubmit('Active')} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : (job?.id ? 'Save Changes' : 'Post Now')}
                </Button>
            </div>
        </div>
      </form>
    </Form>
  );
}

"use server";

import { analyzeResume } from "@/ai/flows/resume-analyzer";
import { z } from "zod";

const AnalyzeResumeSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters."),
  resumeText: z.string().min(50, "Resume text must be at least 50 characters."),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: {
    highlightedResume: string;
    skillsMatchPercentage: number;
  };
};

export async function onAnalyzeResume(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = AnalyzeResumeSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }
  
  try {
    const { jobDescription, resumeText } = parsed.data;
    const result = await analyzeResume({ jobDescription, resumeText });
    
    if (!result || !result.highlightedResume) {
        return { message: "Analysis failed. Please try again." };
    }

    return {
      message: "Analysis successful!",
      data: result,
    };
  } catch (error) {
    return { message: "An unexpected error occurred during analysis." };
  }
}

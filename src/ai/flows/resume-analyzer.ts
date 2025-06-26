// src/ai/flows/resume-analyzer.ts
'use server';

/**
 * @fileOverview A resume analyzer AI agent that highlights skills in a resume which match those in the job description.
 *
 * - analyzeResume - A function that handles the resume analysis process.
 * - AnalyzeResumeInput - The input type for the analyzeResume function.
 * - AnalyzeResumeOutput - The return type for the analyzeResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed.'),
  jobDescription: z
    .string()
    .describe('The job description for which the resume is being analyzed.'),
});
export type AnalyzeResumeInput = z.infer<typeof AnalyzeResumeInputSchema>;

const AnalyzeResumeOutputSchema = z.object({
  highlightedResume: z
    .string()
    .describe(
      'The resume text with skills matching the job description highlighted.'
    ),
  skillsMatchPercentage: z
    .number()
    .describe(
      'The percentage of skills in the resume that match the job description.'
    ),
});
export type AnalyzeResumeOutput = z.infer<typeof AnalyzeResumeOutputSchema>;

export async function analyzeResume(input: AnalyzeResumeInput): Promise<AnalyzeResumeOutput> {
  return analyzeResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeResumeInputSchema},
  output: {schema: AnalyzeResumeOutputSchema},
  prompt: `You are an expert resume analyzer specializing in identifying skills that match a job description.

You will receive a resume and a job description. Your task is to:

1.  Highlight the skills in the resume that match the skills listed or implied in the job description.
2.  Calculate the percentage of skills in the resume that match the job description.

Resume:
{{resumeText}}

Job Description:
{{jobDescription}}

Highlight the resume skills that match job description, and calculate skills match percentage. Return the highlighted resume text and skills match percentage. The highlighted resume must include <mark> tags around any highlighted sections of the resume text.
`,
});

const analyzeResumeFlow = ai.defineFlow(
  {
    name: 'analyzeResumeFlow',
    inputSchema: AnalyzeResumeInputSchema,
    outputSchema: AnalyzeResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);

// src/ai/flows/skills-match-percentage.ts
'use server';

/**
 * @fileOverview Calculates the percentage match between a job description and a resume using AI.
 *
 * - skillsMatchPercentage - A function that calculates the skills match percentage.
 * - SkillsMatchPercentageInput - The input type for the skillsMatchPercentage function.
 * - SkillsMatchPercentageOutput - The return type for the skillsMatchPercentage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillsMatchPercentageInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job posting.'),
  resume: z.string().describe('The text content of the resume.'),
});
export type SkillsMatchPercentageInput = z.infer<
  typeof SkillsMatchPercentageInputSchema
>;

const SkillsMatchPercentageOutputSchema = z.object({
  matchPercentage: z
    .number()
    .describe(
      'The percentage of skills from the job description that match the resume. Must be an integer between 0 and 100.'
    ),
  matchedSkills: z.array(z.string()).describe('A list of skills that matched'),
});
export type SkillsMatchPercentageOutput = z.infer<
  typeof SkillsMatchPercentageOutputSchema
>;

export async function skillsMatchPercentage(
  input: SkillsMatchPercentageInput
): Promise<SkillsMatchPercentageOutput> {
  return skillsMatchPercentageFlow(input);
}

const skillsMatchPercentagePrompt = ai.definePrompt({
  name: 'skillsMatchPercentagePrompt',
  input: {schema: SkillsMatchPercentageInputSchema},
  output: {schema: SkillsMatchPercentageOutputSchema},
  prompt: `You are an AI-powered resume parser that outputs a match percentage between a job description and a resume, as well as the list of matched skills.

Job Description: {{{jobDescription}}}

Resume: {{{resume}}}

Analyze the resume and compare it to the job description. Identify the skills in the resume that match the requirements in the job description.

Output the matchPercentage as an integer between 0 and 100, representing the percentage of skills from the job description that are present in the resume.
Output the matchedSkills as a JSON array of strings representing the skills that matched. Do not include skills that only vaguely match.

Consider both hard and soft skills when determining the match percentage.
`,
});

const skillsMatchPercentageFlow = ai.defineFlow(
  {
    name: 'skillsMatchPercentageFlow',
    inputSchema: SkillsMatchPercentageInputSchema,
    outputSchema: SkillsMatchPercentageOutputSchema,
  },
  async input => {
    const {output} = await skillsMatchPercentagePrompt(input);
    return output!;
  }
);

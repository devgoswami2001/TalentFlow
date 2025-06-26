"use client";

import { useFormState, useFormStatus } from "react-dom";
import { onAnalyzeResume } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

const initialState = {
  message: "",
  data: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Analyze
    </Button>
  );
}

export function ResumeAnalyzer() {
  const [formState, formAction] = useFormState(onAnalyzeResume, initialState);
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formState.message === "Analysis successful!") {
        formRef.current?.reset();
        setJobDescription("");
        setResumeText("");
    }
  }, [formState]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form ref={formRef} action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">AI Resume Analyzer</CardTitle>
            <CardDescription>
              Paste a job description and a resume to see the skills match percentage.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                name="jobDescription"
                placeholder="Paste the full job description here..."
                className="min-h-[200px]"
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="resume-text">Resume Text</Label>
              <Textarea
                id="resume-text"
                name="resumeText"
                placeholder="Paste the candidate's full resume text here..."
                className="min-h-[200px]"
                required
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Analysis Result</CardTitle>
          <CardDescription>
            The highlighted skills and match percentage will appear below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formState.data?.skillsMatchPercentage !== undefined && (
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <Label>Skills Match</Label>
                <span className="text-2xl font-bold font-headline text-primary">
                  {formState.data.skillsMatchPercentage}%
                </span>
              </div>
              <Progress value={formState.data.skillsMatchPercentage} />
            </div>
          )}

          {formState.data?.highlightedResume && (
            <div className="space-y-2">
              <Label>Highlighted Resume</Label>
              <div 
                className="prose prose-sm dark:prose-invert max-h-[400px] overflow-y-auto rounded-md border p-4 whitespace-pre-wrap bg-muted/50"
                dangerouslySetInnerHTML={{ __html: formState.data.highlightedResume }}
              />
            </div>
          )}

          {formState.message && !formState.data && (
             <div className="text-destructive text-sm">{formState.message}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

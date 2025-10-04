
"use client";

import {
    Activity, ArrowDown, Award, Book, Bot, BrainCircuit, Building, Calendar, Check,
    ClipboardList, FileText, Globe, GraduationCap, HardHat, Info, Lightbulb, Linkedin,
    Mail, MapPin, Phone, Puzzle, Target, ThumbsDown, ThumbsUp, User, X
} from "lucide-react";
import { format, parseISO } from 'date-fns';
import { ProgressReportData } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const Section: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode, className?: string }> = ({ icon: Icon, title, children, className }) => (
    <Card className={className}>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

const ScoreBar: React.FC<{ title: string; score: number }> = ({ title, score }) => (
    <div>
        <div className="flex justify-between items-baseline mb-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold font-headline">{score}%</p>
        </div>
        <Progress value={score} />
    </div>
);

export function ApplicantProgressReport({ data }: { data: ProgressReportData }) {
    const { ai_analysis, resume, profile, application } = data;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="bg-muted/30 min-h-screen print:bg-background">
            <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8 space-y-8">
                
                <div className="print:hidden flex justify-end gap-3">
                    <Button onClick={handlePrint}><FileText className="mr-2"/> Print Report</Button>
                    {/* {resume.resume_pdf && (
                        <Button variant="outline" asChild><a href={`${apiBaseUrl}${resume.resume_pdf}`} target="_blank" rel="noreferrer"><ArrowDown className="mr-2"/> Download Resume</a></Button>
                    )} */}
                </div>

                <Card className="overflow-hidden print-card">
                    <div className="relative h-32 bg-gradient-to-r from-primary/80 to-accent/80 print-bg-gradient">
                         <div className="absolute inset-0 bg-black/20"></div>
                    </div>
                    <CardContent className="p-6 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20 relative">
                        <Avatar className="w-32 h-32 border-4 border-background bg-background shadow-lg">
                            <AvatarImage src={`${apiBaseUrl}${profile.profile_picture}`} alt={profile.full_name} data-ai-hint="person portrait"/>
                            <AvatarFallback className="text-5xl">{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow text-center md:text-left pt-4">
                            <h1 className="text-4xl font-bold font-headline text-foreground">{profile.full_name}</h1>
                            <p className="text-lg text-muted-foreground mt-1">{profile.headline}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
                                <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:text-primary"><Mail className="w-4 h-4" />{application.applicant_email}</a>
                                {profile.phone_number && <a href={`tel:${profile.phone_number}`} className="flex items-center gap-2 hover:text-primary"><Phone className="w-4 h-4" />{profile.phone_number}</a>}
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{profile.city}, {profile.country}</span>
                                {profile.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary"><Linkedin className="w-4 h-4"/>LinkedIn</a>}
                            </div>
                        </div>
                        <div className="shrink-0 text-center md:text-right">
                             <p className="text-sm text-muted-foreground">Applied On</p>
                             <p className="font-semibold text-lg">{format(parseISO(application.applied_at), "PPP")}</p>
                             <Badge variant={ai_analysis.fit_level === 'good' || ai_analysis.fit_level === 'excellent' ? 'default' : 'secondary'} className="mt-2 text-base">{ai_analysis.overall_recommendation}</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Section icon={Bot} title="AI Analysis Summary" className="print-card">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 flex flex-col items-center justify-center text-center p-6 bg-muted/50 rounded-lg border">
                            <p className="text-sm font-semibold text-muted-foreground">Overall Fit Score</p>
                            <p className="text-8xl font-bold font-headline text-primary my-2 tracking-tighter">{ai_analysis.score_breakdown.overall_fit.toFixed(0)}%</p>
                            <p className="text-sm text-muted-foreground mt-2 max-w-xs">{ai_analysis.remarks}</p>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 self-center">
                            <ScoreBar title="Skills Match" score={ai_analysis.score_breakdown.skills_match} />
                            <ScoreBar title="Experience Match" score={ai_analysis.score_breakdown.experience_match} />
                            <ScoreBar title="Education Match" score={ai_analysis.score_breakdown.education_match} />
                            <ScoreBar title="Location Match" score={ai_analysis.score_breakdown.location_match} />
                        </div>
                    </div>
                    <Separator className="my-6" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-green-500"/>Strengths</h4>
                             <div className="flex flex-wrap gap-2">
                                {ai_analysis.strengths.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                            </div>
                         </div>
                         <div>
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2"><ThumbsDown className="w-5 h-5 text-amber-500"/>Weaknesses & Missing Skills</h4>
                             <div className="flex flex-wrap gap-2">
                                {ai_analysis.weaknesses.map(w => <Badge key={w} variant="outline">{w}</Badge>)}
                                {ai_analysis.missing_skills.map(s => <Badge key={s} variant="destructive" className="font-normal">{s}</Badge>)}
                                {ai_analysis.weaknesses.length === 0 && ai_analysis.missing_skills.length === 0 && <p className="text-sm text-muted-foreground">No significant weaknesses identified.</p>}
                            </div>
                         </div>
                     </div>
                </Section>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                         <Section icon={HardHat} title="Work Experience" className="print-card">
                             <div className="relative pl-6 space-y-8 border-l-2 border-border/50">
                                {resume.work_experience_data.map((exp, i) => (
                                    <div key={i} className="relative">
                                         <div className="absolute -left-6 w-4 h-4 bg-primary rounded-full ring-8 ring-background -translate-x-1/2"></div>
                                         <p className="text-sm text-muted-foreground">{exp.start_date} - {exp.end_date || 'Present'}</p>
                                         <h4 className="font-semibold text-lg mt-1">{exp.job_title}</h4>
                                         <p className="text-base text-muted-foreground">{exp.company} &middot; {exp.location}</p>
                                         <ul className="list-disc pl-5 mt-3 space-y-2 text-sm text-muted-foreground">
                                             {exp.responsibilities.map((r, idx) => <li key={idx}>{r}</li>)}
                                         </ul>
                                    </div>
                                ))}
                             </div>
                         </Section>
                         <Section icon={GraduationCap} title="Education" className="print-card">
                            {resume.education_data.map((edu, i) => (
                                <div key={i} className="flex gap-4 not-last:mb-6">
                                    <div className="p-3 bg-primary/10 rounded-lg h-fit"><GraduationCap className="w-6 h-6 text-primary/80 shrink-0"/></div>
                                    <div>
                                        <h4 className="font-semibold text-base">{edu.institution}</h4>
                                        <p className="text-sm">{edu.degree}, {edu.field_of_study}</p>
                                        <p className="text-sm text-muted-foreground">{edu.start_date} - {edu.end_date} &middot; CGPA: {edu.cgpa}</p>
                                    </div>
                                </div>
                            ))}
                         </Section>
                         <Section icon={Puzzle} title="Projects" className="print-card">
                            <div className="space-y-6">
                                {resume.projects_data.map((proj, i) => (
                                    <div key={i} className="not-last:pb-6 not-last:border-b">
                                        <h4 className="font-semibold text-base">{proj.project_name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                                    </div>
                                ))}
                            </div>
                         </Section>
                    </div>

                    <div className="space-y-8">
                         <Section icon={BrainCircuit} title="Technical Skills" className="print-card">
                            <div className="flex flex-wrap gap-2">
                                {resume.skills_data.technical.map(skill => <Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>)}
                            </div>
                         </Section>
                         <Section icon={Award} title="Certifications & Achievements" className="print-card">
                             <div className="space-y-4">
                                 {resume.certifications_data.map((cert, i) => (
                                     <div key={i} className="flex gap-3 items-center">
                                         <Award className="w-4 h-4 text-amber-500 shrink-0"/>
                                         <p className="text-sm">{cert.certification} ({cert.year})</p>
                                     </div>
                                 ))}
                                 {resume.achievements_data.map((ach, i) => (
                                     <div key={i} className="flex gap-3 items-start">
                                         <ThumbsUp className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/>
                                         <p className="text-sm">{ach}</p>
                                     </div>
                                 ))}
                             </div>
                         </Section>
                         <Section icon={Lightbulb} title="AI Interview Guidance" className="print-card">
                            <h4 className="font-semibold mb-3">Suggested Questions</h4>
                             <ul className="list-decimal pl-5 space-y-3 text-sm text-muted-foreground">
                                {ai_analysis.suggested_interview_questions.map(q => <li key={q}>{q}</li>)}
                            </ul>
                         </Section>
                    </div>
                </div>

            </div>
        </div>
    );
}

    
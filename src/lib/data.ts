

export type User = {
  id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  full_name: string;
  role: string;
  status: 'active' | 'inactive'; // Derived from is_active if available
  avatar: string;
  can_post_jobs: boolean;
  can_view_applicants: boolean;
  can_edit_profile: boolean;
  can_post_feed: boolean;
  can_manage_team: boolean;
};

export type ScreeningQuestion = {
  question: string;
  type: 'text' | 'boolean';
};

// This type now reflects the API response structure for both list and detail views
export type Job = {
    id: number;
    title: string;
    description: string;
    requiredSkills: string[]; // maps to required_skills
    experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior-level' | 'Lead' | 'Internship'; // maps to experience_level
    workingMode: 'Remote' | 'On-site' | 'Hybrid'; // maps to working_mode
    location: string;
    salaryMin?: number | null;
    salaryMax?: number | null;
    employmentType: 'Full-time' | 'Part-time' | 'Contract'; // maps to employment_type
    applicationDeadline: Date | string; // maps to deadline
    status: 'Active' | 'Draft' | 'Closed';
    is_active?: boolean;
    datePosted: Date | string; // maps to created_at
    screeningQuestions: ScreeningQuestion[];
    applications_count?: number; 
    companyName?: string;
    companyLogo?: string;
};

export type ApplicantProfileData = {
    id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    city: string;
    country: string;
    headline: string;
    summary: string;
};

export type AIRemarks = {
    fit_score: string;
    fit_level: string;
    remarks: string;
    overall_recommendation: string;
    skills_match_score: string;
    experience_match_score: string;
    education_match_score: string;
    location_match_score: string;
    confidence_score: string;
    strengths: string[];
    weaknesses: string[];
    missing_skills: string[];
    matching_skills: string[];
    recommendations: string[];
};

export type ApplicantStatus = 
    | 'applied'
    | 'under_review'
    | 'shortlisted'
    | 'interview_scheduled'
    | 'offer_made'
    | 'hired'
    | 'rejected';


export type Applicant = {
  id: number;
  status: ApplicantStatus;
  applied_at: string;
  cover_letter: string;
  resume: string; // URL
  applicant_profile: ApplicantProfileData;
  ai_remarks: AIRemarks;
  // Kept for backward compatibility in other components, but will be populated from new structure
  name: string; 
  email: string;
  avatar: string;
  jobId: number;
  jobTitle: string;
  appliedDate: string;
  resumeText: string;
  matchPercentage?: number;
};


export type LeadershipMember = {
    id: number;
    name: string;
    position: string;
    bio: string;
    linkedin: string;
    photo_url: string;
}

export type CompanyProfile = {
  id: number;
  company_name: string;
  description: string;
  website: string;
  logo: string; // Mapped from logo_url
  banner: string | null; // Mapped from banner_url
  designation: string;
  active_jobs_count: number;
  total_applications_count: number;
  followers_count: number;
  user_permissions: {
      can_edit_profile: boolean;
  };
  company_stats: {
    total_jobs: number;
    active_jobs: number;
    total_hr_members: number;
    last_job_posted: string | null;
  };
  leadership_team: LeadershipMember[];
};

export type PostComment = {
    id: number;
    post: number;
    user: string;
    user_email: string;
    parent: number | null;
    comment: string;
    likes_count: number;
    replies_count: number;
    created_at: string;
}


// This mock data is no longer used by the JobManagement component but is kept for other parts of the app.
export const jobs: Job[] = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        description: `We are looking for an experienced Senior Frontend Developer to join our team. Responsibilities include developing new user-facing features, building reusable components, and optimizing applications for maximum speed and scalability. Required skills: React, TypeScript, Next.js, Tailwind CSS, and strong understanding of web performance.`,
        requiredSkills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Web Performance'],
        experienceLevel: 'Senior-level',
        workingMode: 'Remote',
        location: 'Global',
        salaryMin: 120000,
        salaryMax: 150000,
        employmentType: 'Full-time',
        applicationDeadline: new Date('2025-08-30'),
        status: 'Active',
        is_active: true,
        datePosted: new Date('2025-07-01'),
        screeningQuestions: [
            { question: 'Describe a challenging project you worked on with Next.js.', type: 'text'},
            { question: 'How do you approach web performance optimization?', type: 'text'}
        ]
    },
    {
        id: 2,
        title: 'Product Manager',
        description: `We are seeking a talented Product Manager to lead the development of our core products. You will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product and customer requirements. Required skills: Product strategy, roadmap planning, user research, agile methodologies, and excellent communication skills.`,
        requiredSkills: ['Product Strategy', 'Roadmap Planning', 'User Research', 'Agile Methodologies', 'Communication'],
        experienceLevel: 'Mid-level',
        workingMode: 'On-site',
        location: 'San Francisco, USA',
        employmentType: 'Full-time',
        applicationDeadline: new Date('2025-08-15'),
        status: 'Active',
        is_active: true,
        datePosted: new Date('2025-06-25'),
        screeningQuestions: []
    },
    {
        id: 3,
        title: 'UX Designer',
        description: `We're hiring a UX Designer to create satisfying and compelling experiences for the users of our products. You'll be working on user flows, wireframes, prototypes, and conducting user research. Required skills: Figma, Sketch, user-centered design principles, prototyping, and collaboration with product and engineering teams.`,
        requiredSkills: ['Figma', 'Sketch', 'User-Centered Design', 'Prototyping'],
        experienceLevel: 'Mid-level',
        workingMode: 'Hybrid',
        location: 'New York, USA',
        employmentType: 'Contract',
        applicationDeadline: new Date('2025-08-10'),
        status: 'Closed',
        is_active: false,
        datePosted: new Date('2025-06-10'),
        screeningQuestions: [{ question: 'Please provide a link to your portfolio.', type: 'text' }]
    },
    {
        id: 4,
        title: 'Marketing Intern',
        description: 'Join our marketing team as an intern and gain hands-on experience in digital marketing, content creation, and social media management.',
        requiredSkills: ['Social Media', 'Content Writing', 'SEO Basics'],
        experienceLevel: 'Internship',
        workingMode: 'Remote',
        location: 'Global',
        employmentType: 'Part-time',
        applicationDeadline: new Date('2025-09-01'),
        status: 'Draft',
        is_active: false,
        datePosted: new Date('2025-07-25'),
        screeningQuestions: [{ question: 'What are your favorite marketing campaigns and why?', type: 'text'}]
    }
];

export const applicants: Applicant[] = [];
    
export type NewsPost = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  video_url?: string | null;
  external_link?: string | null;
  created_at: string;
  updated_at: string;
  company_name: string;
  author_avatar?: string;
  category: "Hiring Announcements" | "Company Culture" | "Industry News" | "Job Fairs / Events";
  visibility: "public" | "internal";
  likes_count: number;
  comments_count: number;
  liked_users_preview: string[];
  comments: PostComment[];
};

export type Note = {
    id: number;
    application: number;
    reviewer: string;
    reviewer_name: string;
    reviewer_email: string;
    remark: string;
    created_at: string;
    updated_at: string;
};


// Progress Report Data Types
export type AIAnalysisData = {
    id: string;
    is_fit: boolean;
    fit_score: string;
    fit_level: string;
    remarks: string;
    skills_match_score: string;
    experience_match_score: string;
    education_match_score: string;
    location_match_score: string;
    analysis_status: string;
    ai_model_version: string;
    confidence_score: string;
    strengths: string[];
    weaknesses: string[];
    missing_skills: string[];
    matching_skills: string[];
    recommendations: string[];
    interview_recommendation: boolean;
    suggested_interview_questions: string[];
    potential_concerns: any[];
    salary_expectation_alignment: string;
    analysis_duration_seconds: number;
    error_message: string;
    created_at: string;
    updated_at: string;
    analyzed_at: string;
    reviewed_by_human: boolean;
    human_override: boolean;
    human_remarks: string;
    overall_recommendation: string;
    score_breakdown: {
        overall_fit: number;
        skills_match: number;
        experience_match: number;
        education_match: number;
        location_match: number;
        confidence: number;
    };
};

export type EducationData = {
    degree: string;
    field_of_study: string;
    institution: string;
    start_date: string;
    end_date: string;
    cgpa: string;
};

export type WorkExperienceData = {
    job_title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    responsibilities: string[];
};

export type SkillsData = {
    technical: string[];
};

export type CertificationData = {
    certification: string;
    year: number;
};

export type ProjectData = {
    project_name: string;
    description: string;
};

export type ResumeData = {
    id: string;
    title: string;
    is_default: boolean;
    is_active: boolean;
    experience_level: string;
    total_experience_years: number;
    total_experience_months: number;
    total_experience_display: string;
    current_company: string;
    current_designation: string;
    current_salary: number;
    notice_period: string;
    education_data: EducationData[];
    work_experience_data: WorkExperienceData[];
    skills_data: SkillsData;
    certifications_data: CertificationData[];
    projects_data: ProjectData[];
    languages_data: any[];
    achievements_data: string[];
    resume_pdf: string;
    resume_doc: null;
    cover_letter: null;
    view_count: number;
    download_count: number;
    completion_percentage: number;
    keywords: string[];
    created_at: string;
    updated_at: string;
    last_accessed: null;
};

export type ProfileData = {
    id: string;
    full_name: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    phone_number: string;
    address_line_1: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    headline: string;
    summary: string;
    job_status: string;
    preferred_job_types: any[];
    preferred_locations: any[];
    expected_salary: null;
    willing_to_relocate: boolean;
    profile_picture: string;
    linkedin_url: string;
    portfolio_url: string;
    profile_visibility: boolean;
    allow_recruiter_contact: boolean;
    preferred_roles: any[];
    dream_companies: any[];
    created_at: string;
    updated_at: string;
};

export type ApplicationData = {
    id: number;
    status: string;
    is_fit: boolean;
    fit_score: number;
    remarks: null;
    cover_letter: string;
    description: string;
    applied_at: string;
    reviewed_at: string;
    applicant_email: string;
    reviewed_by_email: string;
};

export type ProgressReportData = {
    ai_analysis: AIAnalysisData;
    resume: ResumeData;
    profile: ProfileData;
    application: ApplicationData;
    remarks: any[];
};

    
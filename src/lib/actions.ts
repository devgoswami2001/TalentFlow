

"use server";

import { analyzeResume } from "@/ai/flows/resume-analyzer";
import { z } from "zod";
import { cookies } from "next/headers";
import type { Job, NewsPost, CompanyProfile, User } from "./data";

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
    console.error("Error during form analysis:", error);
    return { message: "An unexpected error occurred during analysis." };
  }
}

export async function getAnalysisForApplicant(
  resumeText: string,
  jobDescription: string
) {
  if (!resumeText || !jobDescription) {
    throw new Error("Resume text and job description are required.");
  }
  try {
    const result = await analyzeResume({ jobDescription, resumeText });
    if (!result || !result.highlightedResume) {
      throw new Error("Analysis failed to produce a valid result.");
    }
    return result;
  } catch (error) {
    console.error("Error during applicant analysis:", error);
    throw new Error("An unexpected error occurred during AI analysis.");
  }
}

export async function getDashboardPageData() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return {
        stats: null,
        monthlyData: [],
        error: "User is not authenticated. Please log in again.",
        };
    }

    try {
        const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        };

        const meResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/me/`,
        { headers, cache: 'no-store' }
        );
        if (!meResponse.ok) {
        throw new Error(`Failed to fetch employer profile: ${meResponse.statusText}`);
        }
        const meData = await meResponse.json();
        const employerId = meData.employer_id;
        if (!employerId) {
        throw new Error("Could not retrieve employer ID.");
        }

        const statsUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/dashboard/employer/${employerId}/`;
        
        const statsResponse = await fetch(statsUrl, { headers, cache: 'no-store' });
        
        if (!statsResponse.ok) {
        const errorData = await statsResponse.json();
        throw new Error(errorData.detail || `Failed to fetch dashboard stats: ${statsResponse.statusText}`);
        }
        const stats = await statsResponse.json();
        
        const monthlyData: any[] = []; 

        return {
        stats,
        monthlyData,
        error: null,
        };
    } catch (error: any) {
        console.error("Dashboard Page Error:", error.message);
        return {
        stats: null,
        monthlyData: [],
        error: error.message,
        };
    }
}

// Convert our form data into the format the API expects.
const convertToApiPayload = (jobData: Partial<Job>, status?: 'Active' | 'Draft' | 'Closed') => {
    return {
        title: jobData.title,
        description: jobData.description,
        required_skills: jobData.requiredSkills,
        experience_level: jobData.experienceLevel,
        working_mode: jobData.workingMode,
        location: jobData.location,
        employment_type: jobData.employmentType,
        salary_min: jobData.salaryMin,
        salary_max: jobData.salaryMax,
        deadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline).toISOString().split('T')[0] : undefined,
        is_active: status === 'Active' ? true : (jobData.id ? undefined : true),
        screening_questions: jobData.screeningQuestions,
        is_featured: false, 
    };
};

// Convert API response from list view back to our frontend Job type
const convertFromApiListPayload = (result: any): Job => {
    return {
        id: result.id,
        title: result.title,
        description: result.description || '',
        requiredSkills: result.required_skills || [],
        experienceLevel: result.experience_level,
        workingMode: result.working_mode,
        location: result.location,
        employmentType: result.employment_type,
        applicationDeadline: result.deadline,
        is_active: result.is_active,
        status: result.is_active ? 'Active' : 'Closed',
        datePosted: result.created_at,
        applications_count: result.applications_count,
        screeningQuestions: (result.screening_questions || []).map((q: any) => ({
            question: q.question,
            type: q.type || 'text',
        })),
        salaryMin: result.salary_min,
        salaryMax: result.salary_max
    };
};

// Convert API response from detail/create/update view back to our frontend Job type
const convertFromApiDetailPayload = (result: any): Job => {
    return {
        id: result.id,
        title: result.title,
        description: result.description,
        requiredSkills: result.required_skills,
        experienceLevel: result.experience_level,
        workingMode: result.working_mode,
        location: result.location,
        salaryMin: result.salary_min,
        salaryMax: result.salary_max,
        employmentType: result.employment_type,
        applicationDeadline: result.deadline,
        is_active: result.is_active,
        status: result.is_active ? 'Active' : 'Closed',
        datePosted: result.created_at,
        screeningQuestions: (result.screening_questions || []).map((q: any) => ({
            question: q.question,
            type: q.type || 'text',
        })),
        applications_count: result.applications_count
    };
};


export async function createOrUpdateJob(jobData: Partial<Job>, status: 'Active' | 'Draft' | 'Closed') {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }

    const isUpdate = !!jobData.id;
    const url = isUpdate 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/job-posts/${jobData.id}/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/jobs/`;
        
    const method = isUpdate ? 'PATCH' : 'POST';

    const apiPayload = convertToApiPayload(jobData, status);
    
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiPayload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            let errorMessage = "Failed to save job posting.";
             if (typeof errorData === 'object' && errorData !== null) {
                const messages = Object.values(errorData).flat().map(msg => 
                    typeof msg === 'string' ? msg : Array.isArray(msg) ? msg.join(', ') : 'An unknown error occurred.'
                );
                if (messages.length > 0) errorMessage = messages.join(' ');
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            }
            throw new Error(errorMessage);
        }

        const result = await response.json();
        const newJob = convertFromApiDetailPayload(result);
        return { success: true, data: newJob };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getMyJobs() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { data: [], error: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/my-jobs/`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensure fresh data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to fetch jobs.');
        }

        const results = await response.json();
        if (results && Array.isArray(results.results)) {
            const jobs: Job[] = (results.results).map(convertFromApiListPayload);
            return { data: jobs, error: null };
        }
        return { data: [], error: 'Invalid data structure from API.' };

    } catch (error: any) {
        return { data: [], error: error.message };
    }
}

export async function deleteJob(jobId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/job-posts/${jobId}/`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.status === 204) { // No content on successful deletion
            return { success: true };
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete job.");

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deactivateJob(jobId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/job-posts/${jobId}/deactivate/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return { success: true };
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to deactivate job.");

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}


export async function getJobById(jobId: number) {
  if (isNaN(jobId)) {
    return { data: null, error: "Invalid Job ID provided." };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/jobs/${jobId}/`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { data: null, error: "The requested job posting could not be found." };
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || `Failed to fetch job #${jobId}.`);
    }

    const result = await response.json();
    const job = convertFromApiDetailPayload(result);
    return { data: job, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

// --- News Post Actions ---

export async function getNewsPosts(accessToken?: string) {
    const cookieStore = await cookies();
    const token = accessToken || cookieStore.get('accessToken')?.value;

    if (!token) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to fetch news posts.");
        }

        const result = await response.json();
        return { success: true, data: result.results as NewsPost[] };

    } catch (error: any) {
        console.error("Get News Posts Error:", error);
        return { success: false, error: error.message };
    }
}

export async function createOrUpdateNewsPost(formData: FormData, postId: number | null) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const isUpdate = postId !== null;
    const url = isUpdate 
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/${postId}/`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/`;
    const method = isUpdate ? 'PATCH' : 'POST';
    
    const imageFile = formData.get('image');
    if (isUpdate && imageFile instanceof File && imageFile.size === 0) {
        formData.delete('image');
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("News Post API Error:", errorData);
            const errorMessage = typeof errorData === 'string' ? errorData : JSON.stringify(errorData);
            throw new Error(errorMessage);
        }

        const result = await response.json();
        return { success: true, data: result as NewsPost };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteNewsPost(postId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/${postId}/`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.ok) {
            return { success: true };
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete news post.");

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- HR User Actions ---

const hrUserFormSchema = z.object({
  id: z.number().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal('')),
  first_name: z.string().min(2, "First name is required."),
  last_name: z.string().min(2, "Last name is required."),
  role: z.enum(['HR Manager', 'Recruiter', 'Interviewer'], {
    required_error: "You need to select a role.",
  }),
  can_post_jobs: z.boolean().default(false),
  can_view_applicants: z.boolean().default(true),
  can_edit_profile: z.boolean().default(false),
  can_post_feed: z.boolean().default(false),
  can_manage_team: z.boolean().default(false),
});

type ServerActionResponse = {
    success: boolean;
    message?: string;
    data?: any;
    errors?: Record<string, string[]>;
}

export async function createHrUser(formData: z.infer<typeof hrUserFormSchema>): Promise<ServerActionResponse> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, message: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/`;
    
    const apiPayload = {
        user: {
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            last_name: formData.last_name,
            username: formData.first_name,
        },
        role: formData.role,
        can_post_jobs: formData.can_post_jobs,
        can_view_applicants: formData.can_view_applicants,
        can_edit_profile: formData.can_edit_profile,
        can_post_feed: formData.can_post_feed,
        can_manage_team: formData.can_manage_team,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiPayload),
        });

        const result = await response.json();

        if (!response.ok) {
           return {
                success: false,
                message: result.message || "Failed to create HR user",
                errors: result.user || result.error || {},
            };
        }

        return { success: true, message: result.message, data: result.data };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateHrUser(userId: number, formData: Partial<z.infer<typeof hrUserFormSchema>>): Promise<ServerActionResponse> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, message: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/${userId}/`;
    
    const apiPayload: any = { };
    const userPayload: any = {};

    if(formData.role) apiPayload.role = formData.role;
    if(formData.can_post_jobs !== undefined) apiPayload.can_post_jobs = formData.can_post_jobs;
    if(formData.can_view_applicants !== undefined) apiPayload.can_view_applicants = formData.can_view_applicants;
    if(formData.can_edit_profile !== undefined) apiPayload.can_edit_profile = formData.can_edit_profile;
    if(formData.can_post_feed !== undefined) apiPayload.can_post_feed = formData.can_post_feed;
    if(formData.can_manage_team !== undefined) apiPayload.can_manage_team = formData.can_manage_team;

    if(formData.email) userPayload.email = formData.email;
    if(formData.first_name) userPayload.first_name = formData.first_name;
    if(formData.last_name) userPayload.last_name = formData.last_name;
    
    // Only include password if it's provided and not empty
    if(formData.password) {
        userPayload.password = formData.password;
    }

    if (Object.keys(userPayload).length > 0) {
        apiPayload.user = userPayload;
    }


    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiPayload),
        });

        const result = await response.json();
        
        if (!response.ok) {
             return {
                success: false,
                message: result.message || "Failed to update HR user",
                errors: result.user || result.error || {},
            };
        }

        return { success: true, message: result.message, data: result.data };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}


export async function getHrUsers() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to fetch HR users.");
        }

        const result = await response.json();
        return { success: true, data: result.results };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteHrUser(userId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/${userId}/`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.ok) {
            return { success: true };
        }
        
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to delete HR user.");

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Company Profile Actions ---

const mapApiToCompanyProfile = (apiData: any): CompanyProfile => {
    return {
        id: apiData.id,
        company_name: apiData.company_name,
        description: apiData.description,
        website: apiData.website,
        logo: apiData.logo_url,
        banner: apiData.banner_url,
        designation: apiData.designation,
        // These are now available in company_stats, but keeping them for now for any component that might still use them.
        active_jobs_count: apiData.active_jobs_count,
        total_applications_count: apiData.total_applications_count,
        followers_count: apiData.followers_count,
        user_permissions: {
            can_edit_profile: apiData.user_permissions.can_edit_profile
        },
        company_stats: {
            total_jobs: apiData.company_stats.total_jobs,
            active_jobs: apiData.company_stats.active_jobs,
            total_hr_members: apiData.company_stats.total_hr_members,
            last_job_posted: apiData.company_stats.last_job_posted,
        }
    };
};

export async function getCompanyProfile(token?: string) {
    const cookieStore = await cookies();
    const accessToken = token || cookieStore.get('accessToken')?.value;
    
    if (!accessToken) {
        return { data: null, error: "Not authenticated. Please log in." };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/company-profile/`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            if(response.status === 404) {
                return { data: null, error: "Company profile not found. Please create one." };
            }
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to fetch company profile.");
        }

        const result = await response.json();
        // The actual company data is now nested in the `data` property
        if (result.success && result.data) {
             const mappedData = mapApiToCompanyProfile(result.data);
            return { data: mappedData, error: null };
        } else {
            throw new Error(result.message || "API response was successful, but data is missing.");
        }

    } catch (error: any) {
        console.error("Get Company Profile Error:", error);
        return { data: null, error: error.message };
    }
}

export async function updateCompanyProfile(formData: FormData) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/company-profile/`;
    
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to update company profile.");
        }

        const result = await response.json();
        if (result.success && result.data) {
             const mappedData = mapApiToCompanyProfile(result.data);
             return { success: true, data: mappedData };
        } else {
             throw new Error(result.message || "API response was successful, but data is missing.");
        }

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
    

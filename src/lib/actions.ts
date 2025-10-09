"use server";

import { analyzeResume } from "@/ai/flows/resume-analyzer";
import { z } from "zod";
import { cookies } from "next/headers";
import type { Job, NewsPost, CompanyProfile, User, LeadershipMember, Applicant, Note, ProgressReportData } from "./data";


import { parseISO } from "date-fns";
// -------- Resume Analysis --------

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

// -------- Employer Dashboard --------

export async function getDashboardPageData() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

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
      { headers, cache: "no-store" }
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
    const statsResponse = await fetch(statsUrl, { headers, cache: "no-store" });

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

// -------- Jobs: mapping helpers --------

// Convert our form data into the format the API expects.
const convertToApiPayload = (jobData: Partial<Job>, status?: "Active" | "Draft" | "Closed") => {
  // explicit mapping from status → is_active for deterministic server behavior
  const isActive =
    status === "Active" ? true :
    status === "Closed" ? false :
    status === "Draft" ? false :
    undefined;

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
    deadline: jobData.applicationDeadline
      ? new Date(jobData.applicationDeadline).toISOString().split("T")[0]
      : undefined,
    is_active: isActive,
    screening_questions: jobData.screeningQuestions,
    is_featured: false,
  };
};

// Convert API response (list or minimal) to our frontend Job type
const convertFromApiListPayload = (result: any): Job => {
  // Try to normalize a posted-at ISO string if present on list payloads
  const createdAtISO =
    result.created_at ||
    (result.created_date ? new Date(result.created_date).toISOString() : undefined);

  return {
    id: result.id ?? result.job_id,
    title: result.title ?? result.job_title,
    description: result.description ?? "",
    requiredSkills: result.required_skills ?? [],
    experienceLevel: result.experience_level,
    workingMode: result.working_mode,
    location: result.location,
    employmentType: result.employment_type,
    applicationDeadline: result.deadline,
    is_active: !!result.is_active,
    status: result.is_active ? "Active" : "Closed",
    datePosted: createdAtISO,
    applications_count: result.applications_count ?? 0,
    screeningQuestions: (result.screening_questions ?? []).map((q: any) => ({
      question: q.question,
      type: q.type || "text",
    })),
    salaryMin: result.salary_min ?? undefined,
    salaryMax: result.salary_max ?? undefined,
  };
};

// Convert API response (detail/create/update) to our frontend Job type
const convertFromApiDetailPayload = (result: any): Job => {
  return {
    id: result.id,
    title: result.title,
    description: result.description,
    requiredSkills: result.required_skills ?? [],
    experienceLevel: result.experience_level,
    workingMode: result.working_mode,
    location: result.location,
    salaryMin: result.salary_min ?? undefined,
    salaryMax: result.salary_max ?? undefined,
    employmentType: result.employment_type,
    applicationDeadline: result.deadline,
    is_active: !!result.is_active,
    status: result.is_active ? "Active" : "Closed",
    datePosted: result.created_at, // ISO string from detail
    screeningQuestions: (result.screening_questions ?? []).map((q: any) => ({
      question: q.question,
      type: q.type || "text",
    })),
    applications_count: result.applications_count ?? 0,
    companyName: result.company_name,
    companyLogo: result.company_logo,
  };
};

// -------- Jobs: server actions --------

export async function createOrUpdateJob(jobData: Partial<Job>, status: "Active" | "Draft" | "Closed") {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const isUpdate = !!jobData.id;
  const url = isUpdate
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/job-posts/${jobData.id}/`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/jobs/`;

  const method = isUpdate ? "PATCH" : "POST";

  const apiPayload = convertToApiPayload(jobData, status);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = "Failed to save job posting.";
      if (typeof errorData === "object" && errorData !== null) {
        const messages = Object.values(errorData)
          .flat()
          .map((msg) =>
            typeof msg === "string"
              ? msg
              : Array.isArray(msg)
              ? msg.join(", ")
              : "An unknown error occurred."
          );
        if (messages.length > 0) errorMessage = messages.join(" ");
      } else if (typeof errorData === "string") {
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { data: [], error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/my-jobs/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch jobs.");
    }

    const results = await response.json();

    // If the list is paginated and minimal, hydrate each job with its full detail
    const minimalJobs: Job[] = Array.isArray(results.results)
      ? results.results.map(convertFromApiListPayload)
      : [];

    // Hydrate details for complete card/form data
    const hydrated = await Promise.all(
      minimalJobs.map(async (j) => {
        try {
          const detailRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/jobs/${j.id}/`,
            { method: "GET", headers: { "Content-Type": "application/json" }, cache: "no-store" }
          );
          if (!detailRes.ok) return j;
          const detailJson = await detailRes.json();
          return convertFromApiDetailPayload(detailJson);
        } catch {
          return j;
        }
      })
    );

    return { data: hydrated, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
}

export async function deleteJob(jobId: number) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/job-posts/${jobId}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 204) {
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/employer/job-posts/${jobId}/deactivate/`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
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
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/my-company/`;
    
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
        return { success: true, data: result };

    } catch (error: any) {
        console.error("Get News Posts Error:", error);
        return { success: false, error: error.message };
    }
}


export async function createOrUpdateNewsPost(formData: FormData, postId: number | null) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const isUpdate = postId !== null;
  const url = isUpdate
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/${postId}/`
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/`;
  const method = isUpdate ? "PATCH" : "POST";

  const imageFile = formData.get("image");
  if (isUpdate && imageFile instanceof File && imageFile.size === 0) {
    formData.delete("image");
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("News Post API Error:", errorData);
      const errorMessage = typeof errorData === "string" ? errorData : JSON.stringify(errorData);
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/posts/${postId}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
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

// -------- HR Users --------

const hrUserFormSchema = z.object({
  id: z.number().optional(),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal("")),
  first_name: z.string().min(2, "First name is required."),
  last_name: z.string().min(2, "Last name is required."),
  role: z.enum(["HR Manager", "Recruiter", "Interviewer"], {
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
};

export async function createHrUser(formData: z.infer<typeof hrUserFormSchema>): Promise<ServerActionResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "Not authenticated" };
  }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/`;
    
    const apiPayload = {
        user: {
            email: formData.email,
            password: formData.password,
            first_name: formData.first_name,
            username: formData.email,
            last_name: formData.last_name,
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
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, message: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/${userId}/`;

  const apiPayload: any = {};
  const userPayload: any = {};

  if (formData.role) apiPayload.role = formData.role;
  if (formData.can_post_jobs !== undefined) apiPayload.can_post_jobs = formData.can_post_jobs;
  if (formData.can_view_applicants !== undefined) apiPayload.can_view_applicants = formData.can_view_applicants;
  if (formData.can_edit_profile !== undefined) apiPayload.can_edit_profile = formData.can_edit_profile;
  if (formData.can_post_feed !== undefined) apiPayload.can_post_feed = formData.can_post_feed;
  if (formData.can_manage_team !== undefined) apiPayload.can_manage_team = formData.can_manage_team;

  if (formData.email) userPayload.email = formData.email;
  if (formData.first_name) userPayload.first_name = formData.first_name;
  if (formData.last_name) userPayload.last_name = formData.last_name;

  if (formData.password) {
    userPayload.password = formData.password;
  }

  if (Object.keys(userPayload).length > 0) {
    apiPayload.user = userPayload;
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/hr-users/${userId}/`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
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

// -------- Company Profile --------

const mapApiToCompanyProfile = (apiData: any): CompanyProfile => {
  return {
    id: apiData.id,
    company_name: apiData.company_name ?? "",
    description: apiData.description ?? "",
    website: apiData.website ?? "",
    logo: apiData.logo_url ?? null,
    banner: apiData.banner_url ?? null,
    designation: apiData.designation ?? "",
    active_jobs_count: apiData.active_jobs_count ?? 0,
    total_applications_count: apiData.total_applications_count ?? 0,
    followers_count: apiData.followers_count ?? 0,

    // ✅ use entire object as it is
    user_permissions: {
      can_edit_profile: apiData.user_permissions?.can_edit_profile ?? false,
    },

    company_stats: {
      total_jobs: apiData.company_stats?.total_jobs ?? 0,
      active_jobs: apiData.company_stats?.active_jobs ?? 0,
      total_hr_members: apiData.company_stats?.total_hr_members ?? 0,
      last_job_posted: apiData.company_stats?.last_job_posted ?? null,
    },

    leadership_team: (apiData.leadership_team || []).map(
      (member: any): LeadershipMember => ({
        id: member.id,
        name: member.name,
        position: member.position,
        bio: member.bio,
        linkedin: member.linkedin,
        photo_url: member.photo_url,
      })
    ),
  };
};

export async function getCompanyProfile(token?: string) {
  const cookieStore = await cookies();
  const accessToken = token || cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { data: null, error: "Not authenticated. Please log in." };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/company-profile/`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { data: null, error: "Company profile not found. Please create one." };
      }
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to fetch company profile.");
    }

    const result = await response.json();
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
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return { success: false, error: "Not authenticated" };
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/company-profile/update-profile/`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Update profile failed:", result); // 👈 log full response

      // Build friendly error message
      let errorMessage = result.message || result.detail || "Validation failed";
      if (result.errors) {
        // Flatten field errors into a readable string
        const fieldErrors = Object.entries(result.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(", ")}`)
          .join(" | ");
        errorMessage = `${errorMessage} → ${fieldErrors}`;
      }

      return { success: false, error: errorMessage };
    }

    if (result.success && result.data) {
      const mappedData = mapApiToCompanyProfile(result.data);
      return { success: true, data: mappedData };
    } else {
      return {
        success: false,
        error: result.message || "API response was successful, but data is missing.",
      };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}


export async function createLeadershipMember(formData: FormData): Promise<ServerActionResponse> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, message: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/leadership/create/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });
        
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to add leadership member.",
                errors: result,
            };
        }

        return { success: true, message: "Leadership member added successfully.", data: result };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateLeadershipMember(memberId: number, formData: FormData): Promise<ServerActionResponse> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, message: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/leadership/${memberId}/update/`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData,
        });
        
        const result = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to update leadership member.",
                errors: result,
            };
        }

        return { success: true, message: "Leadership member updated successfully.", data: result };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deleteLeadershipMember(memberId: number): Promise<ServerActionResponse> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, message: "Not authenticated" };
    }

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/leadership/${memberId}/delete/`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        if (response.status !== 204) {
            const result = await response.json();
            return {
                success: false,
                message: result.detail || "Failed to delete leadership member.",
            };
        }

        return { success: true, message: "Leadership member deleted successfully." };

    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
    

    

const mapApiToApplicant = (apiApplicant: any, jobId: number, jobTitle: string): Applicant => {
    return {
        id: apiApplicant.id,
        status: apiApplicant.status,
        applied_at: apiApplicant.applied_at,
        cover_letter: apiApplicant.cover_letter,
        resume: apiApplicant.resume,
        applicant_profile: apiApplicant.applicant_profile,
        ai_remarks: apiApplicant.ai_remarks,
        // Compatibility fields
        name: apiApplicant.applicant_profile.full_name,
        email: apiApplicant.applicant_profile.email,
        avatar: apiApplicant.applicant_profile.profile_picture ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${apiApplicant.applicant_profile.profile_picture}` : `https://placehold.co/40x40`,
        jobId: jobId,
        jobTitle: jobTitle,
        appliedDate: apiApplicant.applied_at,
        resumeText: apiApplicant.applicant_profile.summary || 'No resume text available.',
        matchPercentage: parseFloat(apiApplicant.ai_remarks?.fit_score) || 0,
    };
};

export async function getApplicantsForJob(jobId: number, jobTitle: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/jobs/${jobId}/applicants/`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Failed to fetch applicants for job #${jobId}`);
        }

        const result = await response.json();
        const applicants: Applicant[] = result.results.map((apiApp: any) => mapApiToApplicant(apiApp, jobId, jobTitle));

        return { success: true, data: applicants };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateApplicantStatus(applicationId: number, status: Applicant['status']) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/applications/${applicationId}/status/`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: status }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Failed to update status for application #${applicationId}`);
        }

        const result = await response.json();
        return { success: true, data: result };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- Application Remarks (Notes) Actions ---

export async function getApplicantNotes(applicationId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/application-remarks/?application=${applicationId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Failed to fetch notes for application #${applicationId}`);
        }

        const result = await response.json();
        return { success: true, data: result.results as Note[] };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addApplicantNote(applicationId: number, remark: string) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/application-remarks/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ application: applicationId, remark: remark }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.remark?.[0] || errorData.detail || `Failed to add note.`);
        }

        const result = await response.json();
        return { success: true, data: result as Note };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteApplicantNote(remarkId: number) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { success: false, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/application-remarks/${remarkId}/`;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (response.status === 204) {
            return { success: true };
        }

        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to delete note #${remarkId}.`);

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getApplicantProgressReport(applicationId: string): Promise<{ data: ProgressReportData | null; error: string | null }> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
        return { data: null, error: "Not authenticated" };
    }
    
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/employer/applications/${applicationId}/profile/`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || `Failed to fetch progress report for application #${applicationId}`);
        }

        const result = await response.json();
        return { data: result as ProgressReportData, error: null };

    } catch (error: any) {
        console.error("Get Applicant Progress Report Error:", error);
        return { data: null, error: "Failed to load applicant progress report." };
    }
}


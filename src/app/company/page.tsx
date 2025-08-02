
import { CompanyProfilePage } from "@/components/company-profile-page";
import { getCompanyProfile, getNewsPosts, getMyJobs } from "@/lib/actions";
import { Metadata } from "next";
import type { NewsPost, Job } from "@/lib/data";

export const metadata: Metadata = {
    title: "Company Profile",
    description: "Learn more about our mission, culture, and view all our open positions.",
};

export default async function CompanyPage() {
    const { data: companyProfile, error } = await getCompanyProfile();
    
    let newsPosts: NewsPost[] = [];
    let jobs: Job[] = [];

    if (companyProfile) {
        const newsResult = await getNewsPosts();
        if (newsResult.success && newsResult.data) {
            newsPosts = newsResult.data.filter(p => p.visibility === 'public').slice(0, 2);
        }

        const jobsResult = await getMyJobs();
        if (jobsResult.data && jobsResult.data.length > 0) {
            jobs = jobsResult.data.filter(j => j.status === 'Active');
        }
    }
    
    return <CompanyProfilePage 
        initialCompanyInfo={companyProfile} 
        initialNewsPosts={newsPosts} 
        initialJobs={jobs}
        error={error} 
    />;
}

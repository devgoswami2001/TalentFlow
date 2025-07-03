import { CompanyProfilePage } from "@/components/company-profile-page";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Company Profile",
    description: "Learn more about Hyresense, our mission, culture, and view all our open positions.",
};

export default function CompanyPage() {
    return <CompanyProfilePage />;
}

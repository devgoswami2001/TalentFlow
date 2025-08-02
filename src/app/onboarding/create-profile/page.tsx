
import { CreateEmployerProfile } from "@/components/create-employer-profile";

export default function CreateProfilePage() {
    return (
        <div className="w-full min-h-screen bg-background flex items-center justify-center p-4">
             <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/20 via-accent/10 to-transparent"></div>
            <CreateEmployerProfile />
        </div>
    )
}

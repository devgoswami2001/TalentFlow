import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users } from 'lucide-react';

export default function TeamPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">HR Team</CardTitle>
        <CardDescription>
          This is where you will manage recruiter profiles and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <Users className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Team Management Coming Soon</h3>
          <p className="text-muted-foreground">
            Add/remove HR users and assign roles and permissions here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Notifications</CardTitle>
        <CardDescription>
          This is where you will see all your notifications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <Bell className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Notification Center Coming Soon</h3>
          <p className="text-muted-foreground">
            Stay updated with new applications, interview schedules, and more.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

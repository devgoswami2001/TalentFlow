import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Newspaper } from 'lucide-react';

export default function NewsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">News Feed</CardTitle>
        <CardDescription>
          This is where you will manage your company news and hiring updates.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <Newspaper className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">News Feed Management Coming Soon</h3>
          <p className="text-muted-foreground">
            Create and manage company announcements and posts here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

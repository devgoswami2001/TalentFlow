import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from 'lucide-react';

export default function TalentPoolPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Talent Pool</CardTitle>
        <CardDescription>
          This is where you will bookmark strong candidates for future hiring.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-10 border-2 border-dashed rounded-lg">
          <Star className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-bold">Talent Pool Feature Coming Soon</h3>
          <p className="text-muted-foreground">
            Save and organize promising candidates for future opportunities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

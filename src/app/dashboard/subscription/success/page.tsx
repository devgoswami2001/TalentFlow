"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/dashboard/subscription");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center shadow-2xl border-primary/20">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-bounce" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your subscription has been activated and your workspace is now upgraded.
          </p>
          <div className="p-4 bg-muted rounded-lg inline-block w-full">
            <p className="text-sm font-medium">
              Redirecting to subscription dashboard in <span className="text-primary font-bold text-lg">{countdown}</span> seconds...
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => router.push("/dashboard/subscription")}
          >
            Go Now <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

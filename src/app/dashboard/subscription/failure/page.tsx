"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentFailurePage() {
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
      <Card className="max-w-md w-full text-center shadow-2xl border-destructive/20">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-destructive/10 rounded-full">
              <XCircle className="h-16 w-16 text-destructive animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-destructive">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Oops! Something went wrong with your transaction. No money was charged, or it will be refunded shortly.
          </p>
          <div className="p-4 bg-muted rounded-lg inline-block w-full">
            <p className="text-sm font-medium">
              Returning to subscription page in <span className="text-destructive font-bold text-lg">{countdown}</span> seconds...
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            variant="destructive" 
            onClick={() => router.push("/dashboard/subscription")}
          >
            Try Again <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

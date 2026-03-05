
"use client";

import * as React from "react";
import { Check, Loader2, Zap, CreditCard, ShieldCheck } from "lucide-react";
import type { SubscriptionPlan } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initiatePayUPayment } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

type SubscriptionManagementProps = {
  plans: SubscriptionPlan[];
};

export function SubscriptionManagement({ plans }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleUpgrade = async (planId: string) => {
    setIsLoading(planId);
    try {
      const result = await initiatePayUPayment(planId);
      
      if (result.success && result.data) {
        const payU = result.data;
        
        // Programmatically create and submit PayU form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payU.action;

        const params: Record<string, string> = {
          key: payU.key,
          txnid: payU.txnid,
          amount: payU.amount,
          productinfo: payU.productinfo,
          firstname: payU.firstname,
          email: payU.email,
          phone: payU.phone,
          surl: payU.surl,
          furl: payU.furl,
          hash: payU.hash,
        };

        for (const key in params) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = params[key];
          form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
      } else {
        toast({
          variant: "destructive",
          title: "Payment Initialization Failed",
          description: result.error || "An unknown error occurred.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to connect to payment gateway.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={cn(
            "flex flex-col relative overflow-hidden transition-all duration-300",
            plan.isPopular ? "border-primary shadow-xl scale-105 z-10" : "hover:border-primary/50"
          )}
        >
          {plan.isPopular && (
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg font-bold">MOST POPULAR</Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold text-foreground">
                {plan.price === 0 ? "Free" : `₹${plan.price.toLocaleString()}`}
              </span>
              {plan.price > 0 && <span className="text-sm font-normal">/{plan.interval}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant={plan.price === 0 ? "outline" : "default"}
              disabled={isLoading !== null}
              onClick={() => handleUpgrade(plan.id)}
            >
              {isLoading === plan.id ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : plan.price === 0 ? (
                "Current Plan"
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" /> Upgrade to {plan.name}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}

      <Card className="md:col-span-3 bg-muted/30 border-dashed">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded-full border">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Secure Payments by PayU</h3>
              <p className="text-sm text-muted-foreground">Your transactions are encrypted and processed through industry-leading security protocols.</p>
            </div>
          </div>
          <div className="flex gap-4">
             <CreditCard className="h-10 w-10 text-muted-foreground/50" />
             {/* Add more payment icons here if needed */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

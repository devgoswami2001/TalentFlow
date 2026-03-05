
"use client";

import * as React from "react";
import { Check, Loader2, Zap, CreditCard, ShieldCheck, Users, Clock, BadgeCheck } from "lucide-react";
import type { SubscriptionPlan } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initiatePayUPayment } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type SubscriptionManagementProps = {
  plans: SubscriptionPlan[];
};

export function SubscriptionManagement({ plans }: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = React.useState<number | null>(null);
  const { toast } = useToast();

  const handleUpgrade = async (planId: number) => {
    setIsLoading(planId);
    try {
      // ✅ Using server action that hits /api/v1/employer/subscriptions/initiate-payment/
      const result = await initiatePayUPayment(planId);
      
      if (result.success && result.data) {
        // Response structure: { payu_url: "...", payu_data: { ... } }
        const { payu_url, payu_data } = result.data;
        
        // Programmatically create and submit PayU form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = payu_url;

        // Add all fields from payu_data as hidden inputs
        for (const key in payu_data) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = payu_data[key];
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

  const getPlanFeatures = (plan: SubscriptionPlan) => {
    const features = [
      `${plan.duration_days} Days validity`,
      `${plan.free_hr_logins} Free HR logins included`,
      `₹${parseFloat(plan.extra_hr_login_price).toLocaleString()} per extra login`,
    ];
    
    if (parseFloat(plan.one_time_setup_fee) > 0) {
      features.push(`₹${parseFloat(plan.one_time_setup_fee).toLocaleString()} setup fee`);
    } else {
      features.push("No setup fee");
    }

    if (plan.name === 'Growth' || plan.name === 'Enterprise') {
      features.push("Priority candidate matching");
      features.push("Advanced AI analysis");
    }

    return features;
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plans.map((plan) => {
        const isGrowth = plan.name.toLowerCase() === 'growth';
        return (
          <Card 
            key={plan.id} 
            className={cn(
              "flex flex-col relative overflow-hidden transition-all duration-300",
              isGrowth ? "border-primary shadow-xl scale-105 z-10" : "hover:border-primary/50"
            )}
          >
            {isGrowth && (
              <div className="absolute top-0 right-0">
                <Badge className="rounded-none rounded-bl-lg font-bold">MOST POPULAR</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-between">
                {plan.name}
                {isGrowth && <BadgeCheck className="h-6 w-6 text-primary" />}
              </CardTitle>
              <CardDescription className="pt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">
                    ₹{parseFloat(plan.price).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-sm uppercase">/{plan.plan_type}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Valid for {plan.duration_days} days
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{plan.free_hr_logins} HR Logins</p>
                    <p className="text-[10px] text-muted-foreground">Included in plan</p>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {getPlanFeatures(plan).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full group" 
                variant={isGrowth ? "default" : "outline"}
                disabled={isLoading !== null}
                onClick={() => handleUpgrade(plan.id)}
              >
                {isLoading === plan.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Zap className={cn("mr-2 h-4 w-4 transition-transform group-hover:scale-125", isGrowth && "fill-current")} /> 
                    {isGrowth ? "Upgrade Now" : `Get ${plan.name}`}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}

      <Card className="md:col-span-3 bg-muted/30 border-dashed">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-background rounded-full border shadow-sm">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Secure Payments by PayU</h3>
              <p className="text-sm text-muted-foreground">Your transactions are encrypted and processed through industry-leading security protocols. We support Credit Cards, Net Banking, and UPI.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center opacity-60">
             <CreditCard className="h-8 w-8" />
             <div className="h-8 w-px bg-border" />
             <p className="text-xs font-bold font-mono tracking-tighter">PCI-DSS COMPLIANT</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

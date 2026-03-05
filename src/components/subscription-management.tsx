
"use client";

import * as React from "react";
import { Check, Loader2, Zap, CreditCard, ShieldCheck, Users, Clock, BadgeCheck, Calendar, Star, PlusCircle, MinusCircle } from "lucide-react";
import type { SubscriptionPlan, ActiveSubscription } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { initiatePayUPayment, requestHrSeats } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

type SubscriptionManagementProps = {
  plans: SubscriptionPlan[];
  activeSubscription: ActiveSubscription | null;
};

export function SubscriptionManagement({ plans, activeSubscription }: SubscriptionManagementProps) {
  const [isPlanLoading, setIsPlanLoading] = React.useState<number | null>(null);
  const [isSeatsLoading, setIsSeatsLoading] = React.useState(false);
  const [seatCount, setSeatCount] = React.useState(1);
  const { toast } = useToast();

  /**
   * Helper to programmatically submit PayU form
   */
  const redirectToPayU = (payu_url: string, payu_data: any) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = payu_url;

    for (const key in payu_data) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = payu_data[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  const handleUpgrade = async (planId: number) => {
    setIsPlanLoading(planId);
    try {
      const result = await initiatePayUPayment(planId);
      if (result.success && result.data) {
        redirectToPayU(result.data.payu_url, result.data.payu_data);
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
      setIsPlanLoading(null);
    }
  };

  const handleBuySeats = async () => {
    if (seatCount < 1) return;
    setIsSeatsLoading(true);
    try {
      const result = await requestHrSeats(seatCount);
      if (result.success && result.data) {
        redirectToPayU(result.data.payu_url, result.data.payu_data);
      } else {
        toast({
          variant: "destructive",
          title: "Failed to request seats",
          description: result.error || "An unknown error occurred.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to initiate seat purchase.",
      });
    } finally {
      setIsSeatsLoading(false);
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
    <div className="space-y-10">
      {/* Current Active Subscription Section */}
      {activeSubscription && (
        <Card className="border-primary/50 bg-primary/5 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge variant="default" className="gap-1 px-3 py-1">
              <BadgeCheck className="h-3 w-3" /> ACTIVE
            </Badge>
          </div>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Star className="h-8 w-8 text-primary fill-current" />
              </div>
              <div>
                <CardTitle className="text-2xl font-headline">Current Plan: {activeSubscription.plan_name}</CardTitle>
                <CardDescription>You are currently on the {activeSubscription.plan_name} subscription.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">Expires On</p>
                  <p className="font-bold">{format(new Date(activeSubscription.end_date), "PPP")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">HR Seats</p>
                  <p className="font-bold">{activeSubscription.total_allowed_hr} Total Seats</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-bold text-green-500">Secure & Verified</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Extra Seats Purchase Section */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold font-headline">Need more HR seats?</h3>
                  <p className="text-sm text-muted-foreground">Add extra team members to your workspace instantly.</p>
                </div>
                <div className="flex items-center gap-4 bg-background p-4 rounded-xl border shadow-sm">
                  <div className="grid gap-1.5">
                    <Label htmlFor="seat-count" className="text-xs uppercase text-muted-foreground font-bold">Number of Seats</Label>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                        disabled={isSeatsLoading}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-bold w-8 text-center">{seatCount}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8" 
                        onClick={() => setSeatCount(seatCount + 1)}
                        disabled={isSeatsLoading}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-border mx-2" />
                  <Button 
                    className="h-12 px-6" 
                    onClick={handleBuySeats} 
                    disabled={isSeatsLoading}
                  >
                    {isSeatsLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="mr-2 h-4 w-4 fill-current" />
                    )}
                    Purchase Seats
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => {
          const isGrowth = plan.name.toLowerCase() === 'growth';
          const isCurrentPlan = activeSubscription?.plan === plan.id;

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "flex flex-col relative overflow-hidden transition-all duration-300",
                isGrowth ? "border-primary shadow-xl scale-105 z-10" : "hover:border-primary/50",
                isCurrentPlan && "ring-2 ring-primary ring-offset-2"
              )}
            >
              {isGrowth && !isCurrentPlan && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none rounded-bl-lg font-bold">MOST POPULAR</Badge>
                </div>
              )}
              {isCurrentPlan && (
                <div className="absolute top-0 right-0">
                  <Badge variant="secondary" className="rounded-none rounded-bl-lg font-bold">CURRENT PLAN</Badge>
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
                  variant={isCurrentPlan ? "outline" : (isGrowth ? "default" : "outline")}
                  disabled={isPlanLoading !== null || isCurrentPlan}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {isPlanLoading === plan.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    "Active Plan"
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
    </div>
  );
}

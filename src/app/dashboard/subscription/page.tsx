
import { getSubscriptionPlans, getActiveSubscription } from "@/lib/actions";
import { SubscriptionManagement } from "@/components/subscription-management";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default async function SubscriptionPage() {
  const [plansResult, activeSubResult] = await Promise.all([
    getSubscriptionPlans(),
    getActiveSubscription()
  ]);

  if (plansResult.error || !plansResult.data) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Plans</AlertTitle>
          <AlertDescription>
            {plansResult.error || "Could not load subscription plans. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your workspace plan and payments.</p>
      </div>
      <SubscriptionManagement 
        plans={plansResult.data} 
        activeSubscription={activeSubResult.data?.subscription || null}
      />
    </div>
  );
}

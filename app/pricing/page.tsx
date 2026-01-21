import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getSubscriptionPlans } from "@/lib/supabase/subscriptions"
import PricingClient from "@/components/pricing-client"

export default async function PricingPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch subscription plans from database
  const plans = await getSubscriptionPlans(supabase)

  return <PricingClient user={user} plans={plans} />
}


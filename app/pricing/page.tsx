import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import PricingClient from "@/components/pricing-client"

export default async function PricingPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <PricingClient user={user} />
}


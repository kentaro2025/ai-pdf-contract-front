import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  getUserSubscription,
  getBillingHistory,
  getPaymentMethods,
} from "@/lib/supabase/subscriptions"
import AccountStatus from "@/components/account-status"

export default async function AccountStatusPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch documents count
  const { count: documentsCount } = await supabase
    .from("documents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Fetch questions count
  const { count: questionsCount } = await supabase
    .from("qa_history")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Calculate total storage
  const { data: documents } = await supabase
    .from("documents")
    .select("file_size")
    .eq("user_id", user.id)

  const totalStorage = documents?.reduce((sum, doc) => sum + (doc.file_size || 0), 0) || 0

  // Fetch subscription data
  const subscription = await getUserSubscription(supabase, user.id)
  const billingHistory = await getBillingHistory(supabase, user.id)
  const paymentMethods = await getPaymentMethods(supabase, user.id)

  return (
    <AccountStatus
      user={user}
      documentsCount={documentsCount || 0}
      questionsCount={questionsCount || 0}
      totalStorage={totalStorage}
      subscription={subscription}
      billingHistory={billingHistory}
      paymentMethods={paymentMethods}
    />
  )
}

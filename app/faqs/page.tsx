import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import FAQsClient from "@/components/faqs-client"

export default async function FAQsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <FAQsClient user={user} />
}


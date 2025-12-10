import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import DocsClient from "@/components/docs-client"

export default async function DocsPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <DocsClient user={user} />
}


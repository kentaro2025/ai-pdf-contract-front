import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { getUserRoleServer } from "@/lib/supabase/roles"
import DashboardClient from "@/components/dashboard-client"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Get user role
  const userRole = await getUserRoleServer(user.id)

  // Fetch documents
  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Fetch Q&A history
  const { data: qaHistory, error: qaError } = await supabase
    .from("qa_history")
    .select("*, documents(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <DashboardClient
      user={user}
      userRole={userRole}
      documents={documents || []}
      qaHistory={qaHistory || []}
      docsError={docsError?.message}
      qaError={qaError?.message}
    />
  )
}

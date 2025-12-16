import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminServer } from "@/lib/supabase/roles"
import AdminDashboardClient from "@/components/admin-dashboard-client"

export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?redirect=/admin")
  }

  const isAdmin = await isAdminServer(user.id)
  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Fetch admin data
  const [usersResult, documentsResult, qaResult] = await Promise.all([
    supabase
      .from("user_roles")
      .select(`
        user_id,
        role,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("id, user_id, title, file_name, file_size, upload_date")
      .order("upload_date", { ascending: false })
      .limit(100),
    supabase
      .from("qa_history")
      .select("id, user_id, created_at")
      .order("created_at", { ascending: false }),
  ])

  // For now, we'll use user_id as identifier
  // In production, create a database view that joins auth.users with user_roles
  // to get emails directly from the database
  const usersWithEmail = (usersResult.data || []).map((userRole) => {
    return {
      ...userRole,
      email: `user-${userRole.user_id.slice(0, 8)}`, // Placeholder - will be replaced with actual email from DB view
      created_at: userRole.created_at,
    }
  })

  return (
    <AdminDashboardClient
      currentUser={user}
      users={usersWithEmail}
      documents={documentsResult.data || []}
      qaHistory={qaResult.data || []}
      usersError={usersResult.error?.message}
      documentsError={documentsResult.error?.message}
      qaError={qaResult.error?.message}
    />
  )
}


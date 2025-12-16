import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminServer } from "@/lib/supabase/roles"

/**
 * Admin API route to get user emails
 * GET /api/admin/user-emails?userIds=id1,id2,id3
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Check authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin = await isAdminServer(user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const userIdsParam = searchParams.get("userIds")

    if (!userIdsParam) {
      return NextResponse.json({ error: "userIds parameter is required" }, { status: 400 })
    }

    const userIds = userIdsParam.split(",").filter((id) => id.trim())

    // Fetch user emails from user_roles and try to match with auth
    // Note: In production, you'd want to create a database view or function
    // that joins auth.users with user_roles
    const { data: userRoles, error: rolesError } = await supabase
      .from("user_roles")
      .select("user_id")
      .in("user_id", userIds)

    if (rolesError) {
      console.error("Error fetching user roles:", rolesError)
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
    }

    // Return user IDs (emails would require service role or database view)
    // For now, return user IDs and let frontend handle display
    return NextResponse.json({
      users: (userRoles || []).map((ur) => ({
        user_id: ur.user_id,
        // Email would be fetched from a database view in production
      })),
    })
  } catch (error) {
    console.error("Admin user emails API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


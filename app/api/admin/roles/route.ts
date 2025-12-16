import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { isAdminServer } from "@/lib/supabase/roles"

/**
 * Admin API route for managing user roles
 * PUT /api/admin/roles - Update user role (admin only)
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    const { userId, role } = body

    if (!userId || !role) {
      return NextResponse.json({ error: "userId and role are required" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["admin", "user", "moderator"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }, { status: 400 })
    }

    // Update or insert role
    const { data, error } = await supabase
      .from("user_roles")
      .upsert(
        {
          user_id: userId,
          role: role,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      )
      .select()
      .single()

    if (error) {
      console.error("Error updating role:", error)
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
    }

    return NextResponse.json({ success: true, userRole: data })
  } catch (error) {
    console.error("Admin roles API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


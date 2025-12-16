import { getSupabaseServerClient } from "./server"
import { getSupabaseBrowserClient } from "./client"

export type UserRole = "admin" | "user" | "moderator" | string

/**
 * Get user role from server-side (Server Components, API routes)
 */
export async function getUserRoleServer(userId?: string): Promise<UserRole | null> {
  try {
    const supabase = await getSupabaseServerClient()
    
    // If userId is provided, use it; otherwise get from current session
    let targetUserId = userId
    
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUserId)
      .single()

    if (error || !data) {
      // If no role found, return default 'user' role
      return "user"
    }

    return data.role as UserRole
  } catch (error) {
    console.error("Error getting user role:", error)
    return "user" // Default to 'user' on error
  }
}

/**
 * Get user role from client-side (Client Components)
 */
export async function getUserRoleClient(userId?: string): Promise<UserRole | null> {
  try {
    const supabase = getSupabaseBrowserClient()
    
    // If userId is provided, use it; otherwise get from current session
    let targetUserId = userId
    
    if (!targetUserId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return null
      targetUserId = user.id
    }

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", targetUserId)
      .single()

    if (error || !data) {
      // If no role found, return default 'user' role
      return "user"
    }

    return data.role as UserRole
  } catch (error) {
    console.error("Error getting user role:", error)
    return "user" // Default to 'user' on error
  }
}

/**
 * Check if user has a specific role (server-side)
 */
export async function hasRoleServer(role: UserRole, userId?: string): Promise<boolean> {
  const userRole = await getUserRoleServer(userId)
  return userRole === role
}

/**
 * Check if user has a specific role (client-side)
 */
export async function hasRoleClient(role: UserRole, userId?: string): Promise<boolean> {
  const userRole = await getUserRoleClient(userId)
  return userRole === role
}

/**
 * Check if user has any of the specified roles (server-side)
 */
export async function hasAnyRoleServer(roles: UserRole[], userId?: string): Promise<boolean> {
  const userRole = await getUserRoleServer(userId)
  return roles.includes(userRole || "user")
}

/**
 * Check if user has any of the specified roles (client-side)
 */
export async function hasAnyRoleClient(roles: UserRole[], userId?: string): Promise<boolean> {
  const userRole = await getUserRoleClient(userId)
  return roles.includes(userRole || "user")
}

/**
 * Check if user is admin (server-side)
 */
export async function isAdminServer(userId?: string): Promise<boolean> {
  return hasRoleServer("admin", userId)
}

/**
 * Check if user is admin (client-side)
 */
export async function isAdminClient(userId?: string): Promise<boolean> {
  return hasRoleClient("admin", userId)
}


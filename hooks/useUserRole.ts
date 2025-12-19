"use client"

import { useEffect, useState } from "react"
import { getUserRoleClient, type UserRole } from "@/lib/supabase/roles"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function useUserRole() {
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchRole() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        
        // Handle refresh token errors
        if (error && (error.message.includes("refresh_token_not_found") || 
                      error.message.includes("Invalid Refresh Token"))) {
          console.warn("Refresh token invalid, clearing session")
          try {
            await supabase.auth.signOut()
          } catch (signOutError) {
            console.error("Error signing out:", signOutError)
          }
          setRole(null)
          setLoading(false)
          return
        }
        
        if (!user) {
          setRole(null)
          setLoading(false)
          return
        }

        const userRole = await getUserRoleClient(user.id)
        setRole(userRole)
      } catch (error: any) {
        // Handle unexpected auth errors
        if (error?.message?.includes("refresh_token_not_found") || 
            error?.message?.includes("Invalid Refresh Token")) {
          console.warn("Auth error in useUserRole, clearing session")
          try {
            await supabase.auth.signOut()
          } catch (signOutError) {
            console.error("Error signing out:", signOutError)
          }
          setRole(null)
        } else {
          console.error("Error fetching user role:", error)
          setRole("user") // Default to 'user' on error
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRole()

    // Listen for auth state changes with error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle token refresh errors
      if (event === "TOKEN_REFRESHED" && !session) {
        console.warn("Token refresh failed, clearing session")
        try {
          await supabase.auth.signOut()
        } catch (signOutError) {
          console.error("Error signing out:", signOutError)
        }
        setRole(null)
        setLoading(false)
        return
      }
      fetchRole()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const isAdmin = role === "admin"
  const isUser = role === "user"
  const hasRole = (targetRole: UserRole) => role === targetRole
  const hasAnyRole = (roles: UserRole[]) => role !== null && roles.includes(role)

  return {
    role,
    loading,
    isAdmin,
    isUser,
    hasRole,
    hasAnyRole,
  }
}


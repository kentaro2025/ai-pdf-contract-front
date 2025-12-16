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
        } = await supabase.auth.getUser()
        
        if (!user) {
          setRole(null)
          setLoading(false)
          return
        }

        const userRole = await getUserRoleClient(user.id)
        setRole(userRole)
      } catch (error) {
        console.error("Error fetching user role:", error)
        setRole("user") // Default to 'user' on error
      } finally {
        setLoading(false)
      }
    }

    fetchRole()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
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


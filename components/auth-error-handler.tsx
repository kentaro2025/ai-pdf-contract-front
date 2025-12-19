"use client"

import { useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { isRefreshTokenError } from "@/lib/supabase/auth-utils"
import { useRouter } from "next/navigation"

/**
 * Global error handler for Supabase auth errors
 * This component sets up error handling for refresh token errors
 */
export function AuthErrorHandler() {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Set up global error handler for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Handle token refresh failures
      if (event === "TOKEN_REFRESHED" && !session) {
        console.warn("Token refresh failed, user session expired")
        try {
          await supabase.auth.signOut()
          // Optionally redirect to login
          router.push("/login")
        } catch (error) {
          console.error("Error during sign out:", error)
        }
      }

      // Handle signed out events that might be caused by refresh token errors
      if (event === "SIGNED_OUT") {
        // Check if we're on a protected route and redirect
        const currentPath = window.location.pathname
        if (currentPath.startsWith("/dashboard") || 
            currentPath.startsWith("/upload") || 
            currentPath.startsWith("/ask") ||
            currentPath.startsWith("/admin")) {
          router.push("/login")
        }
      }
    })

    // Handle unhandled promise rejections from Supabase
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      if (isRefreshTokenError(error)) {
        console.warn("Caught refresh token error in unhandled rejection, clearing session")
        event.preventDefault() // Prevent default error logging
        supabase.auth.signOut().catch((signOutError) => {
          console.error("Error signing out:", signOutError)
        })
        // Redirect to login if on protected route
        const currentPath = window.location.pathname
        if (currentPath.startsWith("/dashboard") || 
            currentPath.startsWith("/upload") || 
            currentPath.startsWith("/ask") ||
            currentPath.startsWith("/admin")) {
          router.push("/login")
        }
      }
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [supabase, router])

  return null // This component doesn't render anything
}


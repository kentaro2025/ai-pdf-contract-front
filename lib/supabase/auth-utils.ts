import { AuthError } from "@supabase/supabase-js"

/**
 * Check if an error is a refresh token error
 */
export function isRefreshTokenError(error: unknown): boolean {
  if (error instanceof AuthError) {
    return error.message.includes("refresh_token_not_found") || 
           error.message.includes("Invalid Refresh Token") ||
           error.code === "refresh_token_not_found"
  }
  if (error && typeof error === "object" && "message" in error) {
    const errorMessage = String(error.message)
    return errorMessage.includes("refresh_token_not_found") || 
           errorMessage.includes("Invalid Refresh Token")
  }
  return false
}

/**
 * Check if an error is an auth error that should trigger logout
 */
export function shouldClearSession(error: unknown): boolean {
  if (error instanceof AuthError) {
    // Clear session for refresh token errors and invalid session errors
    return isRefreshTokenError(error) || 
           error.message.includes("Invalid Refresh Token") ||
           error.message.includes("JWT expired") ||
           error.code === "refresh_token_not_found"
  }
  if (error && typeof error === "object" && "message" in error) {
    const errorMessage = String(error.message)
    return errorMessage.includes("refresh_token_not_found") || 
           errorMessage.includes("Invalid Refresh Token") ||
           errorMessage.includes("JWT expired")
  }
  return false
}

/**
 * Safely get user from Supabase with error handling (client-side)
 */
export async function safeGetUserClient(supabase: any) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // If it's a refresh token error, clear the session
      if (shouldClearSession(error)) {
        console.warn("Refresh token invalid, clearing session:", error.message)
        try {
          await supabase.auth.signOut()
        } catch (signOutError) {
          console.error("Error signing out:", signOutError)
        }
        return { user: null, error: null }
      }
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (error: any) {
    // Handle unexpected errors
    if (shouldClearSession(error)) {
      console.warn("Auth error detected, clearing session:", error)
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.error("Error signing out:", signOutError)
      }
      return { user: null, error: null }
    }
    return { user: null, error }
  }
}

/**
 * Safely get user from Supabase with error handling (server-side)
 */
export async function safeGetUserServer(supabase: any) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      // On server-side, we don't sign out, just return null user
      if (shouldClearSession(error)) {
        console.warn("Refresh token invalid on server:", error.message)
        return { user: null, error: null }
      }
      return { user: null, error }
    }
    
    return { user, error: null }
  } catch (error: any) {
    // Handle unexpected errors
    if (shouldClearSession(error)) {
      console.warn("Auth error detected on server:", error)
      return { user: null, error: null }
    }
    return { user: null, error }
  }
}


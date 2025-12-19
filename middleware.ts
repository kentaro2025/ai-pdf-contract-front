import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, redirect to setup page
  if (!supabaseUrl || !supabaseAnonKey) {
    if (request.nextUrl.pathname !== "/setup") {
      const url = request.nextUrl.clone()
      url.pathname = "/setup"
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // Safely get user with error handling for refresh token errors
  let user = null
  try {
    const result = await supabase.auth.getUser()
    user = result.data.user
    // If there's a refresh token error, clear the session
    if (result.error && (result.error.message.includes("refresh_token_not_found") || 
                         result.error.message.includes("Invalid Refresh Token"))) {
      console.warn("Refresh token invalid in middleware, clearing session")
      await supabase.auth.signOut()
      user = null
    }
  } catch (error: any) {
    // Handle unexpected errors
    if (error?.message?.includes("refresh_token_not_found") || 
        error?.message?.includes("Invalid Refresh Token")) {
      console.warn("Auth error in middleware, clearing session")
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        // Ignore sign out errors
      }
    }
    user = null
  }

  // Protect dashboard and upload routes
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/upload") ||
      request.nextUrl.pathname.startsWith("/ask"))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup" ||
      request.nextUrl.pathname === "/")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

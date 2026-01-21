"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { checkSubscriptionLimits, type SubscriptionLimits } from "@/lib/supabase/subscriptions"

export function useSubscriptionLimits(userId: string | null) {
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchLimits = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const subscriptionLimits = await checkSubscriptionLimits(supabase, userId)
        setLimits(subscriptionLimits)
        setError(null)
      } catch (err: any) {
        console.error("Error fetching subscription limits:", err)
        setError(err.message || "Failed to fetch subscription limits")
      } finally {
        setLoading(false)
      }
    }

    fetchLimits()
  }, [userId])

  return { limits, loading, error }
}

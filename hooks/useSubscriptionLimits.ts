"use client"

import { useEffect, useState, useCallback } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { checkSubscriptionLimits, type SubscriptionLimits } from "@/lib/supabase/subscriptions"

export function useSubscriptionLimits(userId: string | null) {
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLimits = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)
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
  }, [userId])

  useEffect(() => {
    fetchLimits()
  }, [fetchLimits])

  return { limits, loading, error, refetch: fetchLimits }
}

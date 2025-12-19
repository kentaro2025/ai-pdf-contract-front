import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import Stripe from "stripe"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve the payment intent to verify it belongs to the user
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.metadata.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check payment status
    if (paymentIntent.status === "succeeded") {
      // Save subscription to database
      const items = JSON.parse(paymentIntent.metadata.items || "[]")
      
      // Here you would typically:
      // 1. Create a subscription record in your database
      // 2. Update user's subscription status
      // 3. Send confirmation email
      
      // For now, we'll just return success
      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        },
      })
    }

    return NextResponse.json({
      success: false,
      status: paymentIntent.status,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
      },
    })
  } catch (error: any) {
    console.error("Error confirming payment:", error)
    return NextResponse.json(
      { error: error.message || "Failed to confirm payment" },
      { status: 500 }
    )
  }
}


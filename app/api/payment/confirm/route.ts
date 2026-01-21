import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  createOrUpdateUserSubscription,
  createBillingHistory,
  getSubscriptionPlanByName,
  createPaymentMethod,
} from "@/lib/supabase/subscriptions"
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
    // Expand payment_method to get card details
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["payment_method"],
    })

    if (paymentIntent.metadata.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check payment status
    if (paymentIntent.status === "succeeded") {
      // Parse subscription items from metadata
      const items = JSON.parse(paymentIntent.metadata.items || "[]")
      const subscriptionItem = items?.[0]

      console.log("Payment intent metadata:", paymentIntent.metadata)
      console.log("Parsed items:", items)
      console.log("Subscription item:", subscriptionItem)

      if (!subscriptionItem) {
        console.error("No subscription item found in payment intent metadata")
        return NextResponse.json({ error: "No subscription item found" }, { status: 400 })
      }

      // Get the plan from database
      const planName = subscriptionItem.name || subscriptionItem.plan
      console.log("Looking for plan with name:", planName)
      
      const plan = await getSubscriptionPlanByName(supabase, planName)
      if (!plan) {
        console.error(`Subscription plan not found: ${planName}`)
        return NextResponse.json({ 
          error: `Subscription plan not found: ${planName}` 
        }, { status: 404 })
      }

      console.log("Found plan:", plan.id, plan.name)

      // Create or update user subscription
      const billingPeriod = subscriptionItem.billingPeriod || subscriptionItem.period || "monthly"
      console.log("Creating/updating subscription with:", {
        userId: user.id,
        planId: plan.id,
        billingPeriod,
        paymentIntentId: paymentIntent.id,
        stripeCustomerId: paymentIntent.customer,
      })

      const subscription = await createOrUpdateUserSubscription(
        supabase,
        user.id,
        plan.id,
        billingPeriod,
        paymentIntent.id,
        paymentIntent.customer as string | undefined
      )

      if (!subscription) {
        console.error("Failed to create/update subscription. Check server logs for details.")
        return NextResponse.json({ 
          error: "Failed to create subscription. Please check server logs for details." 
        }, { status: 500 })
      }

      console.log("Subscription created/updated successfully:", subscription.id)

      // Create billing history entry
      const billingHistory = await createBillingHistory(
        supabase,
        user.id,
        subscription.id,
        plan.id,
        paymentIntent.amount / 100,
        billingPeriod,
        "card",
        "stripe",
        paymentIntent.id,
        "paid",
        {
          stripe_payment_intent_id: paymentIntent.id,
          stripe_customer_id: paymentIntent.customer,
        }
      )

      if (!billingHistory) {
        console.error("Failed to create billing history entry. Check server logs for details.")
        // Don't fail the entire request if billing history fails, but log it
      } else {
        console.log("Billing history created successfully:", billingHistory.id)
      }

      // Save payment method - try multiple ways to get it
      let paymentMethodDetails: any = null

      // Method 1: Check if payment_method is directly on payment intent
      if (paymentIntent.payment_method) {
        if (typeof paymentIntent.payment_method === "string") {
          paymentMethodDetails = await stripe.paymentMethods.retrieve(paymentIntent.payment_method)
        } else {
          paymentMethodDetails = paymentIntent.payment_method
        }
      } else {
        // Method 2: Get payment method from the latest charge
        const charges = await stripe.charges.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        })

        if (charges.data.length > 0 && charges.data[0].payment_method) {
          const charge = charges.data[0]
          if (typeof charge.payment_method === "string") {
            paymentMethodDetails = await stripe.paymentMethods.retrieve(charge.payment_method)
          } else {
            paymentMethodDetails = charge.payment_method
          }
        }
      }

      // Extract card details if available and save payment method
      if (paymentMethodDetails && paymentMethodDetails.type === "card" && paymentMethodDetails.card) {
        const card = paymentMethodDetails.card
        const paymentMethod = await createPaymentMethod(
          supabase,
          user.id,
          "card",
          "stripe",
          paymentMethodDetails.id,
          true, // Set as default
          card.brand,
          card.last4,
          card.exp_month,
          card.exp_year,
          undefined, // paypalEmail
          undefined, // cryptoAddress
          {
            stripe_payment_method_id: paymentMethodDetails.id,
            stripe_customer_id: paymentIntent.customer,
          }
        )

        if (paymentMethod) {
          console.log("Payment method saved successfully:", paymentMethod.id)
        } else {
          console.error("Failed to save payment method. Check server logs for details.")
        }
      } else if (!paymentMethodDetails) {
        console.warn("Could not retrieve payment method details from payment intent or charges")
      }

      return NextResponse.json({
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
        },
        subscription: {
          id: subscription.id,
          plan: plan.name,
          status: subscription.status,
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


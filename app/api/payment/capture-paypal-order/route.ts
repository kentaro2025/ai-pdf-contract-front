import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import {
  createOrUpdateUserSubscription,
  createBillingHistory,
  getSubscriptionPlanByName,
  createPaymentMethod,
} from "@/lib/supabase/subscriptions"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

    const body = await request.json()
    const { orderId, subscriptionItem } = body

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    // PayPal API credentials
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const baseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "PayPal credentials not configured" },
        { status: 500 }
      )
    }

    // Get access token
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    })

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Failed to authenticate with PayPal" },
        { status: 500 }
      )
    }

    const { access_token } = await tokenResponse.json()

    // Capture the order
    const captureResponse = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    if (!captureResponse.ok) {
      const errorData = await captureResponse.text()
      console.error("PayPal capture error:", errorData)
      return NextResponse.json(
        { error: "Failed to capture PayPal order" },
        { status: 500 }
      )
    }

    const captureData = await captureResponse.json()

    if (captureData.status === "COMPLETED") {
      // Get subscription item from request body or try to extract from order
      let planName = "Basic"
      let billingPeriod: "monthly" | "yearly" = "monthly"
      
      if (subscriptionItem) {
        planName = subscriptionItem.name || "Basic"
        billingPeriod = subscriptionItem.billingPeriod || "monthly"
      } else {
        // Try to extract from order description or metadata
        const description = captureData.purchase_units?.[0]?.description || ""
        // Simple parsing - in production, store this in order metadata
        if (description.includes("Pro")) planName = "Pro"
        else if (description.includes("Basic")) planName = "Basic"
      }

      // Get the plan from database
      const plan = await getSubscriptionPlanByName(supabase, planName)
      if (!plan) {
        return NextResponse.json({ error: "Subscription plan not found" }, { status: 404 })
      }

      const amount = parseFloat(
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value || "0"
      )

      // Create or update user subscription
      const subscription = await createOrUpdateUserSubscription(
        supabase,
        user.id,
        plan.id,
        billingPeriod,
        undefined,
        undefined,
        captureData.id
      )

      if (!subscription) {
        return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
      }

      // Create billing history entry
      const billingHistory = await createBillingHistory(
        supabase,
        user.id,
        subscription.id,
        plan.id,
        amount,
        billingPeriod,
        "paypal",
        "paypal",
        captureData.id,
        "paid",
        {
          paypal_order_id: captureData.id,
          paypal_payer_id: captureData.payer?.payer_id,
        }
      )

      if (!billingHistory) {
        console.error("Failed to create billing history entry for PayPal payment. Check server logs for details.")
        // Don't fail the entire request if billing history fails, but log it
      } else {
        console.log("Billing history created successfully for PayPal payment:", billingHistory.id)
      }

      // Save PayPal payment method
      if (captureData.payer?.email_address) {
        const paymentMethod = await createPaymentMethod(
          supabase,
          user.id,
          "paypal",
          "paypal",
          captureData.id, // Use order ID as provider payment method ID
          true, // Set as default
          undefined, // cardBrand
          undefined, // cardLast4
          undefined, // cardExpMonth
          undefined, // cardExpYear
          captureData.payer.email_address, // paypalEmail
          undefined, // cryptoAddress
          {
            paypal_order_id: captureData.id,
            paypal_payer_id: captureData.payer?.payer_id,
          }
        )

        if (paymentMethod) {
          console.log("PayPal payment method saved successfully:", paymentMethod.id)
        } else {
          console.error("Failed to save PayPal payment method. Check server logs for details.")
        }
      }

      return NextResponse.json({
        success: true,
        order: {
          id: captureData.id,
          status: captureData.status,
          amount,
          currency: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code,
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
      status: captureData.status,
      order: {
        id: captureData.id,
        status: captureData.status,
      },
    })
  } catch (error: any) {
    console.error("Error capturing PayPal order:", error)
    return NextResponse.json(
      { error: error.message || "Failed to capture PayPal order" },
      { status: 500 }
    )
  }
}


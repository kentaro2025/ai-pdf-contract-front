import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

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

    const { orderId } = await request.json()

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
      // Save subscription to database
      // Here you would typically:
      // 1. Create a subscription record in your database
      // 2. Update user's subscription status
      // 3. Send confirmation email

      return NextResponse.json({
        success: true,
        order: {
          id: captureData.id,
          status: captureData.status,
          amount: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
          currency: captureData.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code,
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


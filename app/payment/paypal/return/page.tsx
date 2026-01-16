"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

function PayPalReturnPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get("token")
    const payerId = searchParams.get("PayerID")

    if (!token || !payerId) {
      setError("Invalid PayPal return parameters")
      setStatus("error")
      return
    }

    // Get order ID from session storage
    const orderId = sessionStorage.getItem("paypal_order_id")

    if (!orderId) {
      setError("Order ID not found. Please try again.")
      setStatus("error")
      return
    }

    // Capture the PayPal order
    const captureOrder = async () => {
      try {
        const response = await fetch("/api/payment/capture-paypal-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to capture PayPal order")
        }

        const data = await response.json()

        if (data.success) {
          // Clean up session storage
          sessionStorage.removeItem("paypal_order_id")
          sessionStorage.removeItem("subscription_item")
          
          setStatus("success")
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        } else {
          throw new Error("Payment was not successful")
        }
      } catch (err: any) {
        console.error("PayPal capture error:", err)
        setError(err.message || "An error occurred during payment confirmation")
        setStatus("error")
      }
    }

    captureOrder()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6">
          {status === "loading" && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Payment...
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your payment.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600 mb-4">
                Your subscription has been activated. Redirecting to dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error || "An error occurred during payment"}</AlertDescription>
              </Alert>
              <button
                onClick={() => router.push("/payment")}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PayPalReturnPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Loading...
              </h2>
              <p className="text-gray-600">
                Please wait while we process your return.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    }>
      <PayPalReturnPageContent />
    </Suspense>
  )
}

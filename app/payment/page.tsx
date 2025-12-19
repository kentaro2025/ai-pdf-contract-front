"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, CreditCard, Lock, ArrowLeft, CheckCircle2, Bitcoin, Wallet, Coins, AlertCircle } from "lucide-react"
import Navigation from "@/components/navigation"

type PaymentMethod = "card" | "paypal" | "btc" | "eth" | "sol"

interface SubscriptionItem {
  id: string
  name: string
  price: number
  billingPeriod: "monthly" | "yearly"
  description: string
  features: string[]
}

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

function PaymentFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const stripe = useStripe()
  const elements = useElements()
  const [subscriptionItem, setSubscriptionItem] = useState<SubscriptionItem | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [cardholderName, setCardholderName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null)

  // Load subscription data from URL params
  useEffect(() => {
    const planName = searchParams.get("plan")
    const billingPeriod = searchParams.get("period") as "monthly" | "yearly" | null
    const price = searchParams.get("price")
    
    if (planName && billingPeriod && price) {
      setSubscriptionItem({
        id: `${planName.toLowerCase()}-${billingPeriod}`,
        name: planName,
        price: parseFloat(price),
        billingPeriod: billingPeriod,
        description: `${planName} Plan`,
        features: [],
      })
    }
  }, [searchParams])

  // Handle PayPal return/callback
  useEffect(() => {
    const token = searchParams.get("token")
    const payerId = searchParams.get("PayerID")
    const canceled = searchParams.get("canceled")

    if (canceled === "true") {
      setError("PayPal payment was canceled")
      // Clean up URL
      router.replace("/payment")
      return
    }

    if (token && payerId) {
      // PayPal returned successfully, capture the order
      const orderId = sessionStorage.getItem("paypal_order_id")
      if (orderId) {
        handlePayPalCapture(orderId)
      }
    }
  }, [searchParams])

  const handlePayPalCapture = async (orderId: string) => {
    setIsProcessing(true)
    setError(null)

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
        
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        throw new Error("Payment was not successful")
      }
    } catch (err: any) {
      console.error("PayPal capture error:", err)
      setError(err.message || "An error occurred during payment confirmation")
      setIsProcessing(false)
      // Clean up URL
      router.replace("/payment")
    }
  }

  // Create payment intent when subscription item is available
  useEffect(() => {
    if (subscriptionItem && paymentMethod === "card" && !isSuccess) {
      createPaymentIntent()
    }
  }, [subscriptionItem, paymentMethod])

  const createPaymentIntent = async () => {
    if (!subscriptionItem) return
    
    try {
      const response = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subscriptionItem.price,
          currency: "usd",
          items: [subscriptionItem],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create payment intent")
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setPaymentIntentId(data.paymentIntentId)
    } catch (err: any) {
      console.error("Error creating payment intent:", err)
      setError(err.message || "Failed to initialize payment")
    }
  }

  const handlePayPalPayment = async () => {
    if (!subscriptionItem) {
      setError("No subscription selected")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create PayPal order
      const response = await fetch("/api/payment/create-paypal-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: subscriptionItem.price,
          currency: "USD",
          items: [subscriptionItem],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create PayPal order")
      }

      const data = await response.json()

      if (data.approvalUrl) {
        // Store order ID in sessionStorage for later verification
        sessionStorage.setItem("paypal_order_id", data.orderId)
        sessionStorage.setItem("subscription_item", JSON.stringify(subscriptionItem))
        
        // Redirect to PayPal
        window.location.href = data.approvalUrl
      } else {
        throw new Error("No approval URL received from PayPal")
      }
    } catch (err: any) {
      console.error("PayPal payment error:", err)
      setError(err.message || "An error occurred during PayPal payment")
      setIsProcessing(false)
    }
  }

  const handlePayment = async () => {
    if (!subscriptionItem) {
      setError("No subscription selected")
      return
    }

    if (paymentMethod === "paypal") {
      await handlePayPalPayment()
      return
    }

    if (paymentMethod !== "card") {
      // Handle other payment methods (simulated)
      setIsProcessing(true)
      setTimeout(() => {
        setIsProcessing(false)
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }, 2000)
      return
    }

    if (!stripe || !elements || !clientSecret) {
      setError("Stripe is not initialized. Please refresh the page.")
      return
    }

    setIsProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element not found")
      setIsProcessing(false)
      return
    }

    try {
      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName || "Customer",
          },
        },
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setIsProcessing(false)
        return
      }

      if (paymentIntent?.status === "succeeded") {
        // Confirm payment on backend
        const confirmResponse = await fetch("/api/payment/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
          }),
        })

        if (!confirmResponse.ok) {
          const errorData = await confirmResponse.json()
          throw new Error(errorData.error || "Failed to confirm payment")
        }

        setIsSuccess(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError("Payment was not successful. Please try again.")
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "An error occurred during payment")
    } finally {
      setIsProcessing(false)
    }
  }

  if (!subscriptionItem && !isSuccess) {
    return (
      <div className="min-h-screen bg-pattern">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                  <p className="text-xs text-gray-500">Document Intelligence</p>
                </div>
              </Link>
              <Navigation showAuthButtons={false} />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Card className="py-12">
            <CardContent>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No subscription selected</h2>
              <p className="text-gray-600 mb-6">Please select a plan from our pricing page to proceed with payment</p>
              <Link href="/pricing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Pricing Plans</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-pattern">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                  <p className="text-xs text-gray-500">Document Intelligence</p>
                </div>
              </Link>
              <Navigation showAuthButtons={false} />
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
          <Card className="py-12 border-green-200 bg-green-50">
            <CardContent>
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your subscription has been activated. Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-xs text-gray-500">Document Intelligence</p>
              </div>
            </Link>
            <Navigation showAuthButtons={false} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Payment Method
                </CardTitle>
                <CardDescription>Choose your preferred payment method</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Credit Card */}
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === "card"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-gray-700" />
                      <span className="font-semibold">Credit/Debit Card</span>
                    </div>
                    {paymentMethod === "card" && (
                      <Badge className="bg-blue-600 text-white">Selected</Badge>
                    )}
                  </div>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    paymentMethod === "paypal"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PP</span>
                      </div>
                      <span className="font-semibold">PayPal</span>
                    </div>
                    {paymentMethod === "paypal" && (
                      <Badge className="bg-blue-600 text-white">Selected</Badge>
                    )}
                  </div>
                </button>

                {/* Crypto Options */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Cryptocurrency</p>
                  
                  <button
                    onClick={() => setPaymentMethod("btc")}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === "btc"
                        ? "border-orange-600 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bitcoin className="w-5 h-5 text-orange-600" />
                        <span className="font-semibold">Bitcoin (BTC)</span>
                      </div>
                      {paymentMethod === "btc" && (
                        <Badge className="bg-orange-600 text-white">Selected</Badge>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("eth")}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === "eth"
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Coins className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">Ethereum (ETH)</span>
                      </div>
                      {paymentMethod === "eth" && (
                        <Badge className="bg-blue-600 text-white">Selected</Badge>
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("sol")}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      paymentMethod === "sol"
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Wallet className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">Solana (SOL)</span>
                      </div>
                      {paymentMethod === "sol" && (
                        <Badge className="bg-purple-600 text-white">Selected</Badge>
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Card Details Form */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                  <CardDescription>Enter your card information securely</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <div className="bg-white mt-2">
                      <Input
                        id="cardName"
                        type="text"
                        placeholder="John Doe"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        required
                      />  
                    </div>
                  </div>
                  <div>
                    <Label>Card Information</Label>
                    <div className="border border-gray-300 rounded-md p-3 bg-white mt-2">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#32325d",
                              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#fa755a",
                              iconColor: "#fa755a",
                            },
                          },
                          hidePostalCode: true,
                        }}
                        onChange={(e: any) => {
                          if (e.error) {
                            setError(e.error.message)
                          } else {
                            setError(null)
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Your card details are securely processed by Stripe
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Crypto Payment Info */}
            {(paymentMethod === "btc" || paymentMethod === "eth" || paymentMethod === "sol") && (
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Crypto Payment Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      Send <strong>${subscriptionItem?.price.toFixed(2) || "0.00"} USD</strong> worth of{" "}
                      {paymentMethod === "btc" ? "Bitcoin" : paymentMethod === "eth" ? "Ethereum" : "Solana"} to:
                    </p>
                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm break-all">
                      {paymentMethod === "btc" && "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"}
                      {paymentMethod === "eth" && "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}
                      {paymentMethod === "sol" && "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Payment will be confirmed automatically once received (usually within 10-30 minutes)
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PayPal Info */}
            {paymentMethod === "paypal" && (
              <Card className="border-2 border-dashed">
                <CardHeader>
                  <CardTitle>PayPal Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <p className="text-sm text-gray-700 mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <Button 
                    onClick={handlePayPalPayment}
                    disabled={isProcessing || !subscriptionItem}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? "Processing..." : "Continue with PayPal"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24 border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionItem && (
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{subscriptionItem.name} Plan</p>
                        <p className="text-xs text-gray-600">{subscriptionItem.billingPeriod}</p>
                      </div>
                      <span className="font-semibold">${subscriptionItem.price.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                <div className="pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${subscriptionItem?.price.toFixed(2) || "0.00"}</span>
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || (paymentMethod === "card" && (!cardholderName || !clientSecret)) || (paymentMethod === "paypal") || !subscriptionItem}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? "Processing..." : `Pay $${subscriptionItem?.price.toFixed(2) || "0.00"}`}
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Secure payment encrypted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent />
    </Elements>
  )
}


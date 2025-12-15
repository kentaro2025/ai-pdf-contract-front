"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, Lock, ArrowLeft, CheckCircle2, Bitcoin, Wallet, Coins } from "lucide-react"
import Navigation from "@/components/navigation"

type PaymentMethod = "card" | "paypal" | "btc" | "eth" | "sol"

export default function PaymentPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
      clearCart()
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    }, 2000)
  }

  if (items.length === 0 && !isSuccess) {
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No items in cart</h2>
              <p className="text-gray-600 mb-6">Please add items to your cart before proceeding to payment</p>
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
          <Link href="/subscribe">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subscribe
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
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardDetails.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "").replace(/\D/g, "")
                        const formatted = value.match(/.{1,4}/g)?.join(" ") || value
                        setCardDetails({ ...cardDetails, number: formatted })
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardDetails.expiry}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2, 4)}` : value
                          setCardDetails({ ...cardDetails, expiry: formatted })
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        value={cardDetails.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          setCardDetails({ ...cardDetails, cvv: value })
                        }}
                      />
                    </div>
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
                      Send <strong>${getTotal().toFixed(2)} USD</strong> worth of{" "}
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
                  <p className="text-sm text-gray-700 mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Continue with PayPal
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
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.name} Plan</p>
                        <p className="text-xs text-gray-600">{item.billingPeriod}</p>
                      </div>
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-blue-600">${getTotal().toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing || (paymentMethod === "card" && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv))}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isProcessing ? "Processing..." : `Pay $${getTotal().toFixed(2)}`}
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


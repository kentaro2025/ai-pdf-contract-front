"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, Trash2, ArrowRight, ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"

export default function SubscribePage() {
  const router = useRouter()
  const { items, removeFromCart, getTotal, clearCart } = useCart()

  const handleCheckout = () => {
    if (items.length > 0) {
      router.push("/payment")
    }
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/pricing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pricing
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <CreditCard className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Subscribing</h1>
          {items.length > 0 && (
            <Badge className="bg-blue-600 text-white">{items.length} plan{items.length !== 1 ? "s" : ""}</Badge>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">No subscription selected</h2>
              <p className="text-gray-600 mb-6">Choose a plan from our pricing page to get started</p>
              <Link href="/pricing">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  View Pricing Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Subscription Items */}
            {items.map((item) => (
              <Card key={item.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.name} Plan</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-gray-900">${item.price}</span>
                        <span className="text-gray-500 ml-2">
                          /{item.billingPeriod === "monthly" ? "month" : "year"}
                        </span>
                        <Badge className="ml-3 bg-blue-100 text-blue-700">
                          {item.billingPeriod === "monthly" ? "Monthly" : "Yearly"}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600">
                        • {feature}
                      </li>
                    ))}
                    {item.features.length > 3 && (
                      <li className="text-sm text-gray-500">+ {item.features.length - 3} more features</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* Order Summary */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Subtotal ({items.length} plan{items.length !== 1 ? "s" : ""})</span>
                  <span className="text-lg font-semibold text-gray-900">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${getTotal().toFixed(2)}</span>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="flex-1"
                  >
                    Clear Selection
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}


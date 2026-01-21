"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, FileText, ArrowLeft, Zap, Crown, Sparkles } from "lucide-react"
import Navigation from "@/components/navigation"
import type { SubscriptionPlan } from "@/lib/supabase/subscriptions"

interface PricingClientProps {
  user: any | null
  plans: SubscriptionPlan[]
}

export default function PricingClient({ user, plans }: PricingClientProps) {
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  // Map plan names to icons and colors
  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes("pro")) return Crown
    if (name.includes("basic")) return Zap
    return FileText
  }

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes("pro")) return "orange"
    if (name.includes("basic")) return "purple"
    return "blue"
  }

  // Transform database plans to component format
  const transformedPlans = plans.map((plan) => {
    const Icon = getPlanIcon(plan.name)
    const color = getPlanColor(plan.name)
    // Mark Basic plan as popular (or you can add a field to the database)
    const popular = plan.name.toLowerCase() === "basic"

    return {
      id: plan.id,
      name: plan.name,
      price: {
        monthly: Number(plan.price_monthly),
        yearly: Number(plan.price_yearly),
      },
      description: plan.description || "",
      features: plan.features || [],
      icon: Icon,
      color,
      popular,
      maxDocuments: plan.max_documents,
      maxQuestionsPerMonth: plan.max_questions_per_month,
      maxStorageBytes: plan.max_storage_bytes,
    }
  })

  const handleGetStarted = async (plan: typeof transformedPlans[0]) => {
    if (plan.price.monthly === 0) {
      // Free plan - go directly to dashboard or signup
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/signup")
      }
    } else {
      // Paid plan - check if user is logged in
      if (!user) {
        // Store the plan in sessionStorage to restore after login
        const planData = {
          plan: plan.name,
          period: billingPeriod,
          price: plan.price[billingPeriod].toString(),
        }
        sessionStorage.setItem("pendingSubscription", JSON.stringify(planData))
        // Redirect to login with return URL
        router.push(`/login?redirect=/payment&plan=${encodeURIComponent(plan.name)}&period=${billingPeriod}&price=${plan.price[billingPeriod]}`)
        return
      }
      
      // User is logged in - redirect directly to payment with plan data
      router.push(`/payment?plan=${encodeURIComponent(plan.name)}&period=${billingPeriod}&price=${plan.price[billingPeriod]}`)
    }
  }

  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={user ? "/dashboard" : "/login"} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-xs text-gray-500">Document Intelligence</p>
              </div>
            </Link>

            <Navigation showAuthButtons={!user} />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">Select the perfect plan for your document intelligence needs</p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${billingPeriod === "monthly" ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
              className="relative w-14 h-8 bg-blue-600 rounded-full transition-colors"
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  billingPeriod === "yearly" ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className={`text-sm ${billingPeriod === "yearly" ? "font-semibold text-gray-900" : "text-gray-500"}`}>
              Yearly
            </span>
            {billingPeriod === "yearly" && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Save 17%</Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        {transformedPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No subscription plans available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {transformedPlans.map((plan) => {
            const Icon = plan.icon
            const price = plan.price[billingPeriod]
            const monthlyEquivalent = billingPeriod === "yearly" ? price / 12 : price

            return (
              <Card
                key={plan.name}
                className={`relative border-2 transition-all hover:shadow-lg flex flex-col h-full ${
                  plan.popular
                    ? "border-purple-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      plan.color === "blue" ? "bg-blue-100" : plan.color === "purple" ? "bg-purple-100" : "bg-orange-100"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        plan.color === "blue" ? "text-blue-600" : plan.color === "purple" ? "text-purple-600" : "text-orange-600"
                      }`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">${price}</span>
                    {price > 0 && (
                      <span className="text-gray-500 ml-2">
                        /{billingPeriod === "monthly" ? "month" : "year"}
                        {billingPeriod === "yearly" && (
                          <span className="block text-sm mt-1">${monthlyEquivalent.toFixed(2)}/month</span>
                        )}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button
                    onClick={() => handleGetStarted(plan)}
                    className={`w-full ${
                      plan.popular
                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {plan.price.monthly === 0
                      ? "Subscribe to Free"
                      : plan.name === "Basic"
                        ? "Subscribe to Basic"
                        : "Subscribe to Pro"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
          </div>
        )}

        {/* FAQ Section */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">Have questions? Check out our</p>
          <Link href="/faqs">
            <Button variant="outline">View FAQs</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


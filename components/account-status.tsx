"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  LogOut,
  ArrowLeft,
  User,
  Mail,
  Calendar,
  HardDrive,
  MessageSquare,
  CheckCircle2,
  Shield,
  CreditCard,
  Download,
  ArrowUp,
  X,
  AlertTriangle,
  Zap,
  Crown,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import ConfirmDialog from "@/components/confirm-dialog"
import type {
  UserSubscription,
  BillingHistoryItem,
  PaymentMethod,
} from "@/lib/supabase/subscriptions"

interface AccountStatusProps {
  user: any | null
  documentsCount: number
  questionsCount: number
  totalStorage: number
  subscription: UserSubscription | null
  billingHistory: BillingHistoryItem[]
  paymentMethods: PaymentMethod[]
}

export default function AccountStatus({
  user,
  documentsCount,
  questionsCount,
  totalStorage,
  subscription,
  billingHistory,
  paymentMethods,
}: AccountStatusProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Get current plan name from subscription or default to "Free"
  const currentPlanName = subscription?.plan?.name?.toLowerCase() || "free"

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleUpgrade = () => {
    router.push("/pricing")
  }

  const handleCancelSubscription = async () => {
    setIsProcessing(true)
    try {
      // Update subscription to cancel at period end
      const { error } = await supabase
        .from("user_subscriptions")
        .update({
          cancel_at_period_end: true,
          cancelled_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (error) {
        console.error("Error cancelling subscription:", error)
        alert("Failed to cancel subscription. Please try again.")
      } else {
        setCancelDialogOpen(false)
        router.refresh()
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      alert("Failed to cancel subscription. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getPlanDetails = () => {
    if (subscription?.plan) {
      const plan = subscription.plan
      const price =
        subscription.billing_period === "yearly" ? plan.price_yearly : plan.price_monthly
      const features = Array.isArray(plan.features) ? plan.features : []

      let icon = FileText
      let color = "blue"
      if (plan.name === "Basic") {
        icon = Zap
        color = "purple"
      } else if (plan.name === "Pro") {
        icon = Crown
        color = "orange"
      }

      return {
        name: plan.name,
        price,
        icon,
        color,
        features,
        billingPeriod: subscription.billing_period,
        periodEnd: subscription.current_period_end,
      }
    }

    // Default to Free plan
    return {
      name: "Free",
      price: 0,
      icon: FileText,
      color: "blue",
      features: ["Up to 1 documents", "10 questions per month", "Basic AI responses", "Email support"],
      billingPeriod: "monthly" as const,
      periodEnd: null,
    }
  }

  const planDetails = getPlanDetails()
  const PlanIcon = planDetails.icon

  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-xs text-gray-500">Account Status</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Navigation showAuthButtons={false} />
              <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 bg-transparent">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Account Status Overview */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Account Status</CardTitle>
                <CardDescription>Overview of your DocuMind AI account</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* User Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  User Information
                </h3>
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>Email Address</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user?.email || "N/A"}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Account Created</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user?.created_at ? formatDate(user.created_at) : "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>User ID</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user?.id || "N/A"}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Usage Statistics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" />
                  Usage Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs text-blue-700">Documents Uploaded</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-2xl font-bold text-blue-900">{documentsCount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs text-purple-700">Questions Asked</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                        <span className="text-2xl font-bold text-purple-900">{questionsCount}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-2">
                      <CardDescription className="text-xs text-orange-700">Storage Used</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-orange-600" />
                        <span className="text-2xl font-bold text-orange-900">{formatFileSize(totalStorage)}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Plan */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Subscription Plan</CardTitle>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </div>
              <Badge
                className={`${
                  currentPlanName === "free"
                    ? "bg-blue-100 text-blue-700"
                    : currentPlanName === "basic"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                } hover:opacity-90`}
              >
                {subscription?.status === "active" ? "Active" : subscription?.status || "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Current Plan Details */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    planDetails.color === "blue"
                      ? "bg-blue-100"
                      : planDetails.color === "purple"
                        ? "bg-purple-100"
                        : "bg-orange-100"
                  }`}
                >
                  <PlanIcon
                    className={`w-6 h-6 ${
                      planDetails.color === "blue"
                        ? "text-blue-600"
                        : planDetails.color === "purple"
                          ? "text-purple-600"
                          : "text-orange-600"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-lg">{planDetails.name} Plan</h4>
                    {planDetails.price > 0 && (
                      <span className="text-xl font-bold text-gray-900">
                        ${planDetails.price.toFixed(2)}
                        <span className="text-sm font-normal text-gray-600">
                          /{planDetails.billingPeriod === "monthly" ? "month" : "year"}
                        </span>
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 mt-3">
                    {planDetails.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Plan Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {currentPlanName === "free" ? (
                  <Button onClick={handleUpgrade} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleUpgrade} variant="outline" className="flex-1">
                      <ArrowUp className="mr-2 h-4 w-4" />
                      Change Plan
                    </Button>
                    {!subscription?.cancel_at_period_end && (
                      <Button
                        onClick={() => setCancelDialogOpen(true)}
                        variant="outline"
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel Subscription
                      </Button>
                    )}
                    {subscription?.cancel_at_period_end && (
                      <div className="flex-1 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm text-yellow-900">
                          <strong>Subscription will cancel on:</strong>{" "}
                          {planDetails.periodEnd
                            ? new Date(planDetails.periodEnd).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Next Billing Date */}
              {currentPlanName !== "free" && planDetails.periodEnd && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Next billing date:</strong>{" "}
                    {new Date(planDetails.periodEnd).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="border-gray-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Billing History</CardTitle>
            <CardDescription>View and download your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No billing history available</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billingHistory.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {item.plan?.name || "Unknown"} Plan - {item.billing_period === "monthly" ? "Monthly" : "Yearly"} Subscription
                        </td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge
                            className={
                              item.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : item.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.invoice_url ? (
                            <Button variant="ghost" size="sm" asChild>
                              <a href={item.invoice_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4" />
                              </a>
                            </Button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Method */}
        {currentPlanName !== "free" && (
          <Card className="border-gray-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Methods</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              {paymentMethods.length === 0 ? (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No payment methods saved</p>
                  <Button variant="outline" onClick={() => router.push("/pricing")}>
                    Add Payment Method
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          {method.type === "card" && method.card_last4 ? (
                            <>
                              <p className="font-semibold text-gray-900">
                                {method.card_brand
                                  ? method.card_brand.charAt(0).toUpperCase() +
                                    method.card_brand.slice(1)
                                  : "Card"}{" "}
                                •••• {method.card_last4}
                              </p>
                              {method.card_exp_month && method.card_exp_year && (
                                <p className="text-sm text-gray-600">
                                  Expires {method.card_exp_month}/{method.card_exp_year}
                                </p>
                              )}
                            </>
                          ) : method.type === "paypal" && method.paypal_email ? (
                            <>
                              <p className="font-semibold text-gray-900">PayPal</p>
                              <p className="text-sm text-gray-600">{method.paypal_email}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-semibold text-gray-900">
                                {method.type.toUpperCase()}
                              </p>
                              {method.crypto_address && (
                                <p className="text-sm text-gray-600 font-mono text-xs">
                                  {method.crypto_address.slice(0, 10)}...
                                </p>
                              )}
                            </>
                          )}
                          {method.is_default && (
                            <Badge className="mt-1 bg-blue-100 text-blue-700 text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Update
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/dashboard">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout from Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cancel Subscription Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Cancel Subscription"
        description={
          <div className="space-y-3">
            <p>Are you sure you want to cancel your subscription?</p>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-900">
                <p className="font-semibold mb-1">What happens when you cancel:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Your subscription will remain active until the end of the current billing period</li>
                  <li>You will lose access to premium features after the period ends</li>
                  <li>Your data will be preserved, but you'll be downgraded to the Free plan</li>
                </ul>
              </div>
            </div>
          </div>
        }
        confirmText={isProcessing ? "Cancelling..." : "Yes, Cancel Subscription"}
        cancelText="Keep Subscription"
        onConfirm={handleCancelSubscription}
        variant="destructive"
      />
    </div>
  )
}

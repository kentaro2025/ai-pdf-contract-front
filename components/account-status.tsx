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

interface AccountStatusProps {
  user: any | null
  documentsCount: number
  questionsCount: number
  totalStorage: number
}

interface BillingHistoryItem {
  id: string
  date: string
  description: string
  amount: number
  status: "paid" | "pending" | "failed"
  invoiceUrl?: string
}

export default function AccountStatus({ user, documentsCount, questionsCount, totalStorage }: AccountStatusProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [currentPlan, setCurrentPlan] = useState<"free" | "basic" | "pro">("basic")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock billing history data
  const billingHistory: BillingHistoryItem[] = [
    {
      id: "1",
      date: "2024-01-15",
      description: "Basic Plan - Monthly Subscription",
      amount: 9.0,
      status: "paid",
      invoiceUrl: "#",
    },
    {
      id: "2",
      date: "2023-12-15",
      description: "Basic Plan - Monthly Subscription",
      amount: 9.0,
      status: "paid",
      invoiceUrl: "#",
    },
    {
      id: "3",
      date: "2023-11-15",
      description: "Basic Plan - Monthly Subscription",
      amount: 9.0,
      status: "paid",
      invoiceUrl: "#",
    },
  ]

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
    // Simulate cancellation
    setTimeout(() => {
      setCurrentPlan("free")
      setIsProcessing(false)
      setCancelDialogOpen(false)
    }, 1500)
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
    switch (currentPlan) {
      case "free":
        return {
          name: "Free Plan",
          price: 0,
          icon: FileText,
          color: "blue",
          features: ["Up to 10 documents", "50 questions per month", "Basic AI responses", "Email support"],
        }
      case "basic":
        return {
          name: "Basic Plan",
          price: 9.99,
          icon: Zap,
          color: "purple",
          features: ["Up to 100 documents", "500 questions per month", "Advanced AI responses", "Priority support"],
        }
      case "pro":
        return {
          name: "Pro Plan",
          price: 19.99,
          icon: Crown,
          color: "orange",
          features: ["Unlimited documents", "Unlimited questions", "Premium AI responses", "24/7 support"],
        }
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
                    <span className="text-sm font-mono text-gray-900 text-xs">{user?.id || "N/A"}</span>
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
                  currentPlan === "free"
                    ? "bg-blue-100 text-blue-700"
                    : currentPlan === "basic"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-orange-100 text-orange-700"
                } hover:opacity-90`}
              >
                Current Plan
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
                    <h4 className="font-semibold text-gray-900 text-lg">{planDetails.name}</h4>
                    {planDetails.price > 0 && (
                      <span className="text-xl font-bold text-gray-900">
                        ${planDetails.price}
                        <span className="text-sm font-normal text-gray-600">/month</span>
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
                {currentPlan === "free" ? (
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
                    <Button
                      onClick={() => setCancelDialogOpen(true)}
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel Subscription
                    </Button>
                  </>
                )}
              </div>

              {/* Next Billing Date */}
              {currentPlan !== "free" && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Next billing date:</strong>{" "}
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
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
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
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
                          <Button variant="ghost" size="sm" asChild>
                            <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
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
        {currentPlan !== "free" && (
          <Card className="border-gray-200 shadow-sm mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update
                </Button>
              </div>
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

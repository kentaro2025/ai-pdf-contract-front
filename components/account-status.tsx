"use client"

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
} from "lucide-react"
import Link from "next/link"

interface AccountStatusProps {
  user: any
  documentsCount: number
  questionsCount: number
  totalStorage: number
}

export default function AccountStatus({ user, documentsCount, questionsCount, totalStorage }: AccountStatusProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
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

            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700 bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
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
                    <span className="text-sm font-medium text-gray-900">{user.email}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Account Created</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatDate(user.created_at)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>User ID</span>
                    </div>
                    <span className="text-sm font-mono text-gray-900 text-xs">{user.id}</span>
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

              <Separator />

              {/* Account Actions */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Actions</h3>
                <div className="space-y-2 pl-6">
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Subscription Plan</CardTitle>
            <CardDescription>Your current plan and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">Free Plan</h4>
                <p className="text-sm text-gray-600 mt-1">Unlimited document uploads and questions</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Current Plan</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

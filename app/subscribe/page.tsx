"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, CreditCard } from "lucide-react"
import Navigation from "@/components/navigation"

export default function SubscribePage() {
  const router = useRouter()

  // Redirect to pricing page since cart concept has been removed
  useEffect(() => {
    router.replace("/pricing")
  }, [router])

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

      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <Card className="py-12">
          <CardContent>
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Redirecting to Pricing</h2>
            <p className="text-gray-600 mb-6">Please select a plan from our pricing page to proceed</p>
            <Link href="/pricing">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Pricing Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


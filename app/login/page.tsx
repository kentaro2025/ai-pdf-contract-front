import { Suspense } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"
import Navigation from "@/components/navigation"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pattern">
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

      <div className="flex-1 flex items-center justify-center p-4">
        <Suspense fallback={
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">DocuMind AI</h1>
              <p className="text-gray-600">Your intelligent document assistant</p>
            </div>
            <div className="border-gray-200 shadow-xl rounded-lg p-8 bg-white">
              <div className="text-center text-gray-500">Loading...</div>
            </div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}

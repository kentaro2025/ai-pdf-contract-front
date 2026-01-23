"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface NavigationProps {
  showAuthButtons?: boolean
}

export default function Navigation({ showAuthButtons = false }: NavigationProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <nav className="flex items-center gap-6">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/") ? "text-blue-600" : "text-gray-700"
        }`}
      >
        Home
      </Link>
      <Link
        href="/pricing"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/pricing") ? "text-blue-600" : "text-gray-700"
        }`}
      >
        Pricing
      </Link>
      <Link
        href="/faqs"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/faqs") ? "text-blue-600" : "text-gray-700"
        }`}
      >
        FAQs
      </Link>
      <Link
        href="/docs"
        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
          isActive("/docs") ? "text-blue-600" : "text-gray-700"
        }`}
      >
        Docs
      </Link>
      {showAuthButtons && (
        <>
          <Link href="/login">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </nav>
  )
}


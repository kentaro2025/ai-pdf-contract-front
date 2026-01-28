import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthErrorHandler } from "@/components/auth-error-handler"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"),
  title: {
    default: "DocuMind AI - Your Intelligent Document Assistant",
    template: "%s | DocuMind AI",
  },
  description: "Upload PDFs and ask questions powered by AI. Transform your documents into intelligence with advanced AI-powered contract processing and document analysis.",
  keywords: [
    "AI document processing",
    "document intelligence",
    "contract analysis",
    "PDF AI",
    "legal document AI",
    "document Q&A",
    "AI contract review",
    "document automation",
  ],
  authors: [{ name: "DocuMind AI" }],
  creator: "DocuMind AI",
  publisher: "DocuMind AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com",
    siteName: "DocuMind AI",
    title: "DocuMind AI - Your Intelligent Document Assistant",
    description: "Upload PDFs and ask questions powered by AI. Transform your documents into intelligence.",
    images: [
      {
        url: "/icon.svg",
        width: 1200,
        height: 630,
        alt: "DocuMind AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuMind AI - Your Intelligent Document Assistant",
    description: "Upload PDFs and ask questions powered by AI. Transform your documents into intelligence.",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  generator: "Next.js",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthErrorHandler />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

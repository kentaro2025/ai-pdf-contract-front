import type { Metadata } from "next"
import { FileText, Brain, Zap, Shield, Users, Target, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navigation from "@/components/navigation"

export const metadata: Metadata = {
  title: "About Us - DocuMind AI | AI-Powered Document Intelligence",
  description: "Learn about DocuMind AI, our mission to transform document processing with advanced AI technology, and how we help businesses extract insights from contracts and legal documents.",
  keywords: "DocuMind AI, document intelligence, AI document processing, contract analysis, legal document AI, about us",
  openGraph: {
    title: "About Us - DocuMind AI",
    description: "Learn about DocuMind AI and our mission to transform document processing with AI.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us - DocuMind AI",
    description: "Learn about DocuMind AI and our mission to transform document processing with AI.",
  },
}

export default function AboutPage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com"

  // Structured data for About page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About DocuMind AI",
    description: "Learn about DocuMind AI, our mission to transform document processing with advanced AI technology.",
    url: `${baseUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      name: "DocuMind AI",
      url: baseUrl,
      logo: `${baseUrl}/icon.svg`,
      description: "AI-powered document intelligence platform",
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@kncinnovations.com",
        telephone: "+1-704-858-7836",
        contactType: "Customer Service",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Little Ferry",
        addressRegion: "New Jersey",
        addressCountry: "US",
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
            <Navigation showAuthButtons={true} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About DocuMind AI</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're revolutionizing how businesses interact with documents through the power of artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              At DocuMind AI, we believe that valuable information shouldn't be buried in lengthy documents. Our mission is to make document intelligence accessible to everyone, enabling businesses to extract insights, answer questions, and make informed decisions faster than ever before.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We combine cutting-edge AI technology with intuitive design to transform how you interact with contracts, legal documents, and business files. No more manual searching, no more missed details—just instant, accurate answers when you need them.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We continuously push the boundaries of AI technology to deliver the most advanced document intelligence solutions.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Your documents are encrypted and secure. We prioritize data privacy and protection in everything we do.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Speed & Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We understand that time is valuable. Our platform delivers instant results without compromising accuracy.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>User-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  We design our platform with users in mind, ensuring an intuitive and seamless experience for everyone.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* What We Do */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <Award className="w-6 h-6 text-blue-600" />
              What We Do
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              DocuMind AI is an intelligent document processing platform that uses advanced artificial intelligence to help businesses:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Upload and process PDF contracts and legal documents instantly</li>
              <li>Ask questions in natural language and receive accurate, context-aware answers</li>
              <li>Extract key information and insights from complex documents</li>
              <li>Save time by eliminating manual document review processes</li>
              <li>Make informed decisions based on comprehensive document analysis</li>
            </ul>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6">Join thousands of businesses using DocuMind AI to transform their document workflows.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm">
            <p>&copy; {new Date().getFullYear()} DocuMind AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}

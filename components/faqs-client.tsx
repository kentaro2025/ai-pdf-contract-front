"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"

interface FAQsClientProps {
  user: any | null
}

export default function FAQsClient({ user }: FAQsClientProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What is DocuMind AI?",
      answer:
        "DocuMind AI is an intelligent document assistant that allows you to upload PDF documents and ask questions about them. Our AI-powered system extracts information from your documents and provides accurate answers to your questions.",
    },
    {
      question: "How do I upload a document?",
      answer:
        "Simply click on the 'Upload PDF' button, select your PDF file, and wait for it to be processed. Once uploaded, you can start asking questions about the document content.",
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, we support PDF files only. We're working on adding support for other document formats in the future.",
    },
    {
      question: "How accurate are the AI responses?",
      answer:
        "Our AI uses advanced natural language processing and retrieval-augmented generation (RAG) to provide accurate answers based on your document content. The accuracy depends on the quality and clarity of the source document.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, your data is secure. We use industry-standard encryption and security measures. Each user's documents are isolated and can only be accessed by the account owner. We never share your documents with third parties.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer:
        "If you exceed your plan limits, you'll be notified and can upgrade to a higher plan. Your existing documents and questions will remain accessible.",
    },
    {
      question: "Can I delete my documents?",
      answer:
        "Yes, you can delete any document from your dashboard. Deleting a document will also remove all associated Q&A history.",
    },
    {
      question: "Do you offer API access?",
      answer:
        "API access is available for Basic and Pro plans. You can integrate DocuMind AI into your own applications using our REST API.",
    },
    {
      question: "How do I upgrade or downgrade my plan?",
      answer:
        "You can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and billing is prorated.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "Free plan users get email support, while Basic and Pro plan users get priority support. Pro plan users also get 24/7 support access.",
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Find answers to common questions about DocuMind AI</p>
        </div>

        {/* FAQs */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <Card key={index} className="border-gray-200 shadow-sm">
              <CardContent className="p-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Check out our documentation or contact support.</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/docs">
                <Button variant="outline">View Documentation</Button>
              </Link>
              <Link href={user ? "/dashboard" : "/signup"}>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


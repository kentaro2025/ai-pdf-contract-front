"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Book,
  Code,
  Upload,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Shield,
  BarChart3,
  Users,
} from "lucide-react"
import Navigation from "@/components/navigation"

interface DocsClientProps {
  user: any | null
}

export default function DocsClient({ user }: DocsClientProps) {
  const sections = [
    {
      title: "Getting Started",
      description: "Learn how to get started with DocuMind AI",
      icon: Book,
      items: [
        { title: "Introduction", href: "#introduction" },
        { title: "Quick Start Guide", href: "#quick-start" },
        { title: "Creating an Account", href: "#account" },
        { title: "First Steps", href: "#first-steps" },
      ],
    },
    {
      title: "Uploading Documents",
      description: "How to upload and manage your documents",
      icon: Upload,
      items: [
        { title: "Supported Formats", href: "#formats" },
        { title: "Upload Process", href: "#upload" },
        { title: "Document Management", href: "#management" },
        { title: "File Size Limits", href: "#file-size" },
      ],
    },
    {
      title: "Asking Questions",
      description: "How to ask questions and get answers",
      icon: MessageSquare,
      items: [
        { title: "Question Format", href: "#format" },
        { title: "Best Practices", href: "#practices" },
        { title: "Understanding Answers", href: "#answers" },
        { title: "Chat Interface", href: "#chat" },
      ],
    },
    {
      title: "Dashboard & Features",
      description: "Overview of dashboard and key features",
      icon: BarChart3,
      items: [
        { title: "Dashboard Overview", href: "#dashboard" },
        { title: "Statistics", href: "#stats" },
        { title: "Document List", href: "#doc-list" },
        { title: "Q&A History", href: "#qa-history" },
      ],
    },
    {
      title: "Account Management",
      description: "Manage your account and settings",
      icon: Users,
      items: [
        { title: "Account Status", href: "#account-status" },
        { title: "User Profile", href: "#profile" },
        { title: "Data Security", href: "#security" },
      ],
    },
    {
      title: "API Reference",
      description: "Integrate DocuMind AI into your applications",
      icon: Code,
      items: [
        { title: "Authentication", href: "#auth" },
        { title: "Upload Endpoint", href: "#upload-api" },
        { title: "Query Endpoint", href: "#query-api" },
        { title: "Document Management", href: "#doc-api" },
      ],
    },
  ]

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-xl text-gray-600">Complete guide to using DocuMind AI</p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Card key={section.title} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item, index) => (
                      <li key={index}>
                        <a href={item.href} className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Documentation Content */}
        <div className="space-y-12">
          {/* Introduction */}
          <Card id="introduction" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <FileText className="w-6 h-6" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                DocuMind AI is an intelligent document assistant that allows you to upload PDF documents and ask questions about them using advanced AI technology. Our system uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware answers based on your document content.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Upload and process PDF documents</li>
                  <li>Ask natural language questions about your documents</li>
                  <li>Get instant AI-powered answers with source citations</li>
                  <li>Multi-user support with complete data isolation</li>
                  <li>Document management and Q&A history tracking</li>
                  <li>RESTful API for integration</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card id="quick-start" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Zap className="w-6 h-6" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Create an Account</h3>
                <p className="text-gray-700 mb-2">
                  Visit the <Link href="/signup" className="text-blue-600 hover:underline">signup page</Link> and create your account with your email and password.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Upload Your First Document</h3>
                <p className="text-gray-700 mb-2">
                  Click the "Upload PDF" button on your dashboard, select a PDF file, and wait for it to be processed. The system will extract text, create embeddings, and make it searchable.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 3: Ask Questions</h3>
                <p className="text-gray-700 mb-2">
                  Navigate to the "Ask Questions" page, select your document, and start asking questions. The AI will search through your document and provide accurate answers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Creating Account */}
          <Card id="account" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Creating an Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                To get started with DocuMind AI, you need to create an account. This ensures your documents are secure and isolated from other users.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Account Creation Process:</h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Click "Sign Up" on the login page</li>
                  <li>Enter your email address and create a password</li>
                  <li>Verify your email (if required)</li>
                  <li>You'll be automatically logged in and redirected to the dashboard</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* First Steps */}
          <Card id="first-steps" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">First Steps After Signup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Once you've created your account, here's what you should do:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Explore the Dashboard:</strong> Familiarize yourself with the interface and navigation</li>
                <li><strong>Upload a Test Document:</strong> Start with a simple PDF to understand how the system works</li>
                <li><strong>Try Asking Questions:</strong> Ask various types of questions to see how the AI responds</li>
                <li><strong>Check Your Account Status:</strong> View your usage statistics and account information</li>
              </ul>
            </CardContent>
          </Card>

          {/* Supported Formats */}
          <Card id="formats" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Supported Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Currently, DocuMind AI supports PDF files (.pdf) only. We're working on adding support for other document formats in future updates.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Important Notes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                      <li>PDFs must contain extractable text (not just images)</li>
                      <li>Scanned PDFs may require OCR processing first</li>
                      <li>Password-protected PDFs are not supported</li>
                      <li>Maximum file size depends on your plan</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Process */}
          <Card id="upload" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Upload Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Uploading a document is a simple process that happens in several stages:
              </p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">File Selection</h4>
                    <p className="text-gray-700 text-sm">Click "Upload PDF" and select your file, or drag and drop it into the upload area.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Upload to Storage</h4>
                    <p className="text-gray-700 text-sm">The file is uploaded to secure cloud storage (0-60% progress).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Text Extraction</h4>
                    <p className="text-gray-700 text-sm">Text is extracted from the PDF and split into manageable chunks (60-90% progress).</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Embedding Generation</h4>
                    <p className="text-gray-700 text-sm">AI embeddings are generated for semantic search capabilities.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-semibold">5</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Indexing</h4>
                    <p className="text-gray-700 text-sm">Document is indexed in the vector database and ready for queries (90-100% progress).</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management */}
          <Card id="management" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Document Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your dashboard provides comprehensive document management features:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">View Documents</h4>
                  <p className="text-sm text-gray-700">See all your uploaded documents with file size, upload date, and title.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Ask Questions</h4>
                  <p className="text-sm text-gray-700">Click the message icon to ask questions about a specific document.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Delete Documents</h4>
                  <p className="text-sm text-gray-700">Remove documents and all associated Q&A history with the delete button.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Upload More</h4>
                  <p className="text-sm text-gray-700">Easily upload additional documents from the dashboard or upload page.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Size Limits */}
          <Card id="file-size" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">File Size Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                File size limits depend on your subscription plan:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Plan</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Max File Size</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Total Storage</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Free</td>
                      <td className="border border-gray-300 px-4 py-2">10 MB</td>
                      <td className="border border-gray-300 px-4 py-2">100 MB</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Basic</td>
                      <td className="border border-gray-300 px-4 py-2">50 MB</td>
                      <td className="border border-gray-300 px-4 py-2">5 GB</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Pro</td>
                      <td className="border border-gray-300 px-4 py-2">200 MB</td>
                      <td className="border border-gray-300 px-4 py-2">Unlimited</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Question Format */}
          <Card id="format" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MessageSquare className="w-6 h-6" />
                Question Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                You can ask questions in natural language. The AI understands various question types:
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Factual Questions</h4>
                  <p className="text-blue-800 text-sm">"What is the contract duration?" or "What is the salary mentioned?"</p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Summary Questions</h4>
                  <p className="text-green-800 text-sm">"Summarize the key terms" or "What are the main points?"</p>
                </div>
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Comparison Questions</h4>
                  <p className="text-purple-800 text-sm">"What are the differences between section A and B?"</p>
                </div>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                  <h4 className="font-semibold text-orange-900 mb-2">Specific Detail Questions</h4>
                  <p className="text-orange-800 text-sm">"What does clause 5.2 say?" or "Who are the parties involved?"</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Best Practices */}
          <Card id="practices" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Best Practices for Asking Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Be Specific</h4>
                    <p className="text-gray-700 text-sm">Specific questions yield better results than vague ones.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Use Context</h4>
                    <p className="text-gray-700 text-sm">Reference specific sections, dates, or terms when possible.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Ask One Question at a Time</h4>
                    <p className="text-gray-700 text-sm">Multiple questions in one query may reduce answer quality.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Refine Your Questions</h4>
                    <p className="text-gray-700 text-sm">If the answer isn't satisfactory, try rephrasing or being more specific.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Understanding Answers */}
          <Card id="answers" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Understanding Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Answers are generated using Retrieval-Augmented Generation (RAG), which means:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Answers are based on content from your uploaded documents</li>
                <li>The AI searches for relevant passages before generating an answer</li>
                <li>Answers include source citations when available</li>
                <li>If information isn't in your documents, the AI will indicate that</li>
              </ul>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Answer Format</h4>
                <p className="text-blue-800 text-sm">
                  Answers preserve line breaks and formatting, making them easy to read. Multi-paragraph answers are displayed with proper spacing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card id="chat" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Chat Interface</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The chat interface provides a conversational experience:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Question Display</h4>
                  <p className="text-gray-700 text-sm">Your questions appear immediately when submitted, shown in blue bubbles on the right.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Loading State</h4>
                  <p className="text-gray-700 text-sm">While processing, you'll see a "Thinking..." indicator with a spinner.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Answer Display</h4>
                  <p className="text-gray-700 text-sm">Answers appear in gray bubbles on the left, preserving formatting and line breaks.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Keyboard Shortcuts</h4>
                  <p className="text-gray-700 text-sm">Press Enter to send, Shift+Enter for a new line.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Overview */}
          <Card id="dashboard" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Dashboard Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your dashboard is the central hub for managing your documents and viewing your activity:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Top Navigation</h4>
                  <p className="text-sm text-gray-700">Access Pricing, FAQs, Docs, Upload, and your account menu.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Statistics Cards</h4>
                  <p className="text-sm text-gray-700">View total documents, questions asked, and account status at a glance.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Document List</h4>
                  <p className="text-sm text-gray-700">See all your documents with quick actions to ask questions or delete.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Q&A History</h4>
                  <p className="text-sm text-gray-700">Review your recent questions and answers for quick reference.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card id="stats" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The dashboard displays three key statistics:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Total Documents:</strong> Number of PDFs you've uploaded</li>
                <li><strong>Total Questions:</strong> Number of questions you've asked across all documents</li>
                <li><strong>Account Status:</strong> Your current subscription status (Active/Inactive)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Document List */}
          <Card id="doc-list" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Document List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The document list shows:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Document title (filename without extension)</li>
                <li>File size in human-readable format</li>
                <li>Upload date</li>
                <li>Quick action buttons (Ask Questions, Delete)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Q&A History */}
          <Card id="qa-history" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Q&A History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Your Q&A history displays:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Recent questions you've asked</li>
                <li>Corresponding answers</li>
                <li>Document title for each Q&A pair</li>
                <li>Creation timestamp</li>
              </ul>
              <p className="text-gray-700 text-sm mt-4">
                Note: Q&A history is tied to specific documents. When you delete a document, its Q&A history is also removed.
              </p>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card id="account-status" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                The Account Status page provides comprehensive information about your account:
              </p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">User Information</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                    <li>Email address</li>
                    <li>Account creation date</li>
                    <li>User ID</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Usage Statistics</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                    <li>Documents uploaded count</li>
                    <li>Questions asked count</li>
                    <li>Total storage used</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Subscription Plan</h4>
                  <p className="text-sm text-gray-700">View your current plan and available features.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card id="security" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                DocuMind AI takes security seriously:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">User Isolation</h4>
                    <p className="text-gray-700 text-sm">Each user's documents are completely isolated. You can only access your own documents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Secure Storage</h4>
                    <p className="text-gray-700 text-sm">Documents are stored in secure cloud storage with encryption.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Authentication</h4>
                    <p className="text-gray-700 text-sm">All API requests require user authentication via user ID headers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">No Data Sharing</h4>
                    <p className="text-gray-700 text-sm">We never share your documents or data with third parties.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Authentication */}
          <Card id="auth" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">API Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                All API requests require user authentication. You can provide your user ID in two ways:
              </p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre className="text-sm">
{`// Method 1: Via Header (Recommended)
X-User-ID: your-user-id

// Method 2: Via Request Body/Query
{
  "user_id": "your-user-id"
}`}
                </pre>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-800 text-sm">
                    <strong>Important:</strong> Never expose your user ID in client-side code. Always use server-side API routes or secure authentication mechanisms.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload API */}
          <Card id="upload-api" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Upload Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">POST /upload</h3>
                <p className="text-gray-700 mb-4">Upload a PDF document for processing and indexing.</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Request</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                  <pre className="text-sm">
{`Headers:
  X-User-ID: your-user-id (required)
  Content-Type: multipart/form-data

Body (Form Data):
  file: PDF file (required)
  document_id: string (optional)
  title: string (optional)
  file_size: number (optional)
  file_url: string (optional)`}
                  </pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                  <pre className="text-sm">
{`{
  "status": "ingested",
  "filename": "document.pdf",
  "user_id": "user-123",
  "document_id": "doc-456"
}`}
                  </pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`curl -X POST https://api.documind.ai/upload \\
  -H "X-User-ID: user-123" \\
  -F "file=@document.pdf" \\
  -F "document_id=doc-456" \\
  -F "title=My Document"`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Query API */}
          <Card id="query-api" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Query Endpoint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">POST /query</h3>
                <p className="text-gray-700 mb-4">Ask a question about your documents and get an AI-generated answer.</p>
                
                <h4 className="font-semibold text-gray-900 mb-2">Request</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                  <pre className="text-sm">
{`Headers:
  X-User-ID: your-user-id (required)
  Content-Type: application/json

Body:
{
  "question": "What is the main topic?",
  "user_id": "user-123",
  "document_id": "doc-456" (optional)
}`}
                  </pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Response</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4">
                  <pre className="text-sm">
{`{
  "answer": "The main topic is...",
  "sources": ["document.pdf"],
  "passages": ["relevant text passage..."]
}`}
                  </pre>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`curl -X POST https://api.documind.ai/query \\
  -H "Content-Type: application/json" \\
  -H "X-User-ID: user-123" \\
  -d '{
    "question": "What is the main topic?",
    "document_id": "doc-456"
  }'`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Management API */}
          <Card id="doc-api" className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Document Management Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GET /documents</h3>
                <p className="text-gray-700 mb-2">List all documents for a user.</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`Headers:
  X-User-ID: your-user-id (required)

Response:
{
  "documents": [
    {
      "id": 1,
      "user_id": "user-123",
      "document_id": "doc-456",
      "path": "./data/user-123/document.pdf",
      "filename": "document.pdf",
      "num_chunks": 25,
      "title": "My Document",
      "file_size": 1024000,
      "file_url": "https://..."
    }
  ],
  "count": 1
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GET /documents/:document_id</h3>
                <p className="text-gray-700 mb-2">Get a specific document by ID.</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`Headers:
  X-User-ID: your-user-id (required)

Response:
{
  "id": 1,
  "user_id": "user-123",
  "document_id": "doc-456",
  "path": "./data/user-123/document.pdf",
  "filename": "document.pdf",
  "num_chunks": 25,
  "title": "My Document",
  "file_size": 1024000,
  "file_url": "https://..."
}`}
                  </pre>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">DELETE /documents/:document_id</h3>
                <p className="text-gray-700 mb-2">Delete a document and its associated vectors.</p>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                  <pre className="text-sm">
{`Headers:
  X-User-ID: your-user-id (required)

Response:
{
  "status": "deleted",
  "document_id": "doc-456",
  "vectors_deleted": 25
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UI Workflow */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Complete UI Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Login/Signup Flow</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Visit the login page</li>
                  <li>Click "Sign Up" if you don't have an account</li>
                  <li>Enter email and password</li>
                  <li>You're automatically redirected to the dashboard</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Upload Document Flow</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Click "Upload PDF" button from dashboard or navigation</li>
                  <li>Select a PDF file or drag and drop</li>
                  <li>Watch progress indicator (0-60%: upload, 60-90%: processing, 90-100%: indexing)</li>
                  <li>Success message appears and you're redirected to dashboard</li>
                  <li>Document appears in your document list</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Ask Questions Flow</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Click "Ask Questions" from dashboard or click message icon on a document</li>
                  <li>Select the document you want to query (if multiple documents)</li>
                  <li>Type your question in the text area</li>
                  <li>Press Enter or click Send</li>
                  <li>Question appears immediately in chat</li>
                  <li>"Thinking..." indicator shows while processing</li>
                  <li>Answer appears below the question when ready</li>
                  <li>Continue asking more questions in the same conversation</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Document Management Flow</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>View all documents on dashboard</li>
                  <li>Click message icon to ask questions about a specific document</li>
                  <li>Click delete icon to remove a document (with confirmation)</li>
                  <li>Deleted documents and their Q&A history are permanently removed</li>
                </ol>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Account Management Flow</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>Click your avatar in the top right</li>
                  <li>View account menu with email</li>
                  <li>Click "Account Status" card or navigate to account status page</li>
                  <li>View usage statistics, user information, and subscription plan</li>
                  <li>Logout from account menu or account status page</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
              <p className="text-gray-600 mb-6">Start using DocuMind AI today and experience intelligent document processing.</p>
              <div className="flex items-center justify-center gap-4">
                <Link href={user ? "/dashboard" : "/signup"}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline">View Pricing</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

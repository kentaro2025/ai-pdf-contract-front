"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Send, Loader2, LogOut, ArrowLeft, Bot, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import Navigation from "@/components/navigation"

interface Document {
  id: string
  title: string
  file_name: string
  file_url: string
}

interface QAItem {
  id: string
  question: string
  answer: string | null
  created_at: string
  isLoading?: boolean
  error?: string
}

interface AskClientProps {
  user: any
  documents: Document[]
  selectedDocId: string
  initialQAHistory: QAItem[]
  docsError?: string
}

export default function AskClient({ user, documents, selectedDocId, initialQAHistory, docsError }: AskClientProps) {
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [qaHistory, setQaHistory] = useState<QAItem[]>(initialQAHistory)
  const [currentDocId, setCurrentDocId] = useState(selectedDocId)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [qaHistory])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleDocumentChange = (docId: string) => {
    setCurrentDocId(docId)
    router.push(`/ask?document=${docId}`)
    router.refresh()
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || loading) return

    setError("")
    setLoading(true)

    const userQuestion = question.trim()
    setQuestion("")

    // Create a temporary ID for the loading question
    const tempId = `temp-${Date.now()}`

    // Add question immediately with loading state
    setQaHistory((prev) => [
      ...prev,
      {
        id: tempId,
        question: userQuestion,
        answer: null,
        created_at: new Date().toISOString(),
        isLoading: true,
      },
    ])

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: currentDocId,
          question: userQuestion,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        const errorMessage =
          response.status === 404
            ? "Document not found. Please try selecting a different document."
            : response.status === 401
              ? "Unauthorized. Please log in again."
              : data.error || "Failed to get answer. Please try again."
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (!data.answer || data.answer.trim() === "") {
        throw new Error("No answer received. The document may not be fully processed yet.")
      }

      // Update the question with the answer
      setQaHistory((prev) =>
        prev.map((qa) =>
          qa.id === tempId
            ? {
                id: data.id,
                question: userQuestion,
                answer: data.answer,
                created_at: new Date().toISOString(),
                isLoading: false,
              }
            : qa
        )
      )
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get answer"
      setError(errorMessage)
      
      // Update the question with error state
      setQaHistory((prev) =>
        prev.map((qa) =>
          qa.id === tempId
            ? {
                ...qa,
                isLoading: false,
                error: errorMessage,
              }
            : qa
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  const selectedDocument = documents.find((doc) => doc.id === currentDocId)

  return (
    <div className="min-h-screen bg-pattern flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Ask Questions</h1>
                  <p className="text-xs text-gray-500">Get AI-powered answers</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Navigation showAuthButtons={false} />
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700">{getInitials(user.email)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Account</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl flex flex-col">
        {/* Document Selector */}
        <Card className="p-4 mb-4 border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Document:</label>
            <Select value={currentDocId} onValueChange={handleDocumentChange}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {documents.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {docsError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{docsError}</AlertDescription>
          </Alert>
        )}

        {/* Chat Messages */}
        <Card className="flex-1 mb-4 border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {qaHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a Conversation</h3>
                  <p className="text-gray-500 max-w-sm">
                    Ask any question about <strong>{selectedDocument?.title}</strong> and get instant AI-powered answers
                  </p>
                </div>
              </div>
            ) : (
              <>
                {qaHistory.map((qa) => (
                  <div key={qa.id} className="space-y-4">
                    {/* User Question */}
                    <div className="flex items-start gap-3 justify-end">
                      <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%]">
                        <p className="text-sm leading-relaxed">{qa.question}</p>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>

                    {/* AI Answer */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                        {qa.isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                            <span className="text-sm text-gray-500">Thinking...</span>
                          </div>
                        ) : qa.error ? (
                          <p className="text-sm text-red-600 leading-relaxed">{qa.error}</p>
                        ) : qa.answer ? (
                          <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">{qa.answer}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}


            <div ref={messagesEndRef} />
          </div>
        </Card>

        {/* Input Form */}
        <Card className="p-4 border-gray-200 shadow-sm">
          <form onSubmit={handleAskQuestion} className="flex gap-3">
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about this document..."
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAskQuestion(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={!question.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white h-[60px] px-6"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
        </Card>
      </div>
    </div>
  )
}

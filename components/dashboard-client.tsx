"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Upload, MessageSquare, LogOut, Trash2, Calendar, BarChart3, Loader2 } from "lucide-react"
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

interface Document {
  id: string
  title: string
  file_name: string
  file_size: number
  upload_date: string
  file_url: string
}

interface QAHistory {
  id: string
  question: string
  answer: string
  created_at: string
  documents: { title: string }
}

interface DashboardClientProps {
  user: any
  documents: Document[]
  qaHistory: QAHistory[]
  docsError?: string
  qaError?: string
}

export default function DashboardClient({ user, documents, qaHistory, docsError, qaError }: DashboardClientProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document? This will also delete all associated Q&A history.")) {
      return
    }

    setDeletingId(documentId)
    setError("")

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete document")
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete document")
    } finally {
      setDeletingId(null)
    }
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
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-xs text-gray-500">Document Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload PDF
                </Button>
              </Link>

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

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{documents.length}</div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Questions</CardTitle>
              <MessageSquare className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{qaHistory.length}</div>
            </CardContent>
          </Card>

          <Link href="/account-status">
            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Account Status</CardTitle>
                <BarChart3 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">Active</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documents Section */}
          <div>
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Documents</CardTitle>
                    <CardDescription>Manage your uploaded PDF files</CardDescription>
                  </div>
                  <Link href="/upload">
                    <Button size="sm" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {docsError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{docsError}</AlertDescription>
                  </Alert>
                )}

                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No documents uploaded yet</p>
                    <Link href="/upload">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Your First Document
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{doc.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{formatFileSize(doc.file_size)}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(doc.upload_date)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/ask?document=${doc.id}`}>
                            <Button size="sm" variant="outline" className="h-8 bg-transparent">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteDocument(doc.id)}
                            disabled={deletingId === doc.id}
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {deletingId === doc.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Q&A History Section */}
          <div>
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Questions</CardTitle>
                <CardDescription>Your latest Q&A interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {qaError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{qaError}</AlertDescription>
                  </Alert>
                )}

                {qaHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 mb-4">No questions asked yet</p>
                    {documents.length > 0 && (
                      <Link href={`/ask?document=${documents[0].id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Ask Your First Question
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {qaHistory.map((qa) => (
                      <div key={qa.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{qa.question}</p>
                            <p className="text-xs text-gray-500 mt-1">{qa.documents.title}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{qa.answer}</p>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(qa.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

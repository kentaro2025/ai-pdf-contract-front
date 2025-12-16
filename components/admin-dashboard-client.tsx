"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  FileText,
  MessageSquare,
  DollarSign,
  BarChart3,
  Shield,
  Search,
  Edit,
  Trash2,
  Download,
  Calendar,
  Mail,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  UserPlus,
  FileCheck,
} from "lucide-react"
import Link from "next/link"
import Navigation from "@/components/navigation"
import ConfirmDialog from "@/components/confirm-dialog"

interface User {
  user_id: string
  email: string
  role: string
  created_at: string
  updated_at: string
}

interface Document {
  id: string
  user_id: string
  title: string
  file_name: string
  file_size: number
  upload_date: string
}

interface QAHistory {
  id: string
  user_id: string
  created_at: string
}

interface AdminDashboardClientProps {
  currentUser: any
  users: User[]
  documents: Document[]
  qaHistory: QAHistory[]
  usersError?: string
  documentsError?: string
  qaError?: string
}

type TabType = "overview" | "users" | "documents" | "subscriptions" | "analytics"

export default function AdminDashboardClient({
  currentUser,
  users,
  documents,
  qaHistory,
  usersError,
  documentsError,
  qaError,
}: AdminDashboardClientProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editRoleDialogOpen, setEditRoleDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState("user")
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isDeletingUser, setIsDeletingUser] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Calculate statistics
  const totalUsers = users.length
  const totalDocuments = documents.length
  const totalQuestions = qaHistory.length
  const adminUsers = users.filter((u) => u.role === "admin").length
  const regularUsers = users.filter((u) => u.role === "user").length

  // Filter users by search
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleEditRole = (user: User) => {
    setSelectedUser(user)
    setNewRole(user.role)
    setEditRoleDialogOpen(true)
  }

  const handleUpdateRole = async () => {
    if (!selectedUser) return

    setIsUpdatingRole(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/admin/roles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.user_id,
          role: newRole,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update role")
      }

      setSuccess("Role updated successfully")
      setEditRoleDialogOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to update role")
    } finally {
      setIsUpdatingRole(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setDeleteUserDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    setIsDeletingUser(true)
    setError("")
    setSuccess("")

    try {
      // Note: This would require admin API endpoint to delete users
      // For now, we'll just show an error
      setError("User deletion requires backend implementation")
      setDeleteUserDialogOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to delete user")
    } finally {
      setIsDeletingUser(false)
      setUserToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocuMind AI</h1>
                <p className="text-xs text-gray-500">Administrative Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Navigation showAuthButtons={false} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "documents", label: "Documents", icon: FileText },
            { id: "subscriptions", label: "Subscriptions", icon: DollarSign },
            { id: "analytics", label: "Analytics", icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{totalUsers}</div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {adminUsers} admins, {regularUsers} users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{totalDocuments}</div>
                    <FileText className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Across all users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Questions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">{totalQuestions}</div>
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Q&A interactions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Subscriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold">-</div>
                    <DollarSign className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">To be implemented</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {users.slice(0, 5).map((user) => (
                      <div key={user.user_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.email}</p>
                            <p className="text-xs text-gray-500">{formatDate(user.created_at)}</p>
                          </div>
                        </div>
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Documents</CardTitle>
                  <CardDescription>Latest uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.slice(0, 5).map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="text-sm font-medium">{doc.title}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(doc.upload_date)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage user accounts and roles</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {usersError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{usersError}</AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell className="font-mono text-xs">{user.user_id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.role === "admin"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRole(user)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {user.user_id !== currentUser.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.user_id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Documents</CardTitle>
                <CardDescription>View and manage all uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                {documentsError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{documentsError}</AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>File Name</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>User ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell className="text-sm text-gray-600">{doc.file_name}</TableCell>
                          <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                          <TableCell>{formatDate(doc.upload_date)}</TableCell>
                          <TableCell className="font-mono text-xs">{doc.user_id.slice(0, 8)}...</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
                <CardDescription>Manage user subscriptions and billing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Subscription management coming soon</p>
                  <p className="text-sm text-gray-400 mt-2">
                    This feature will allow you to view and manage all user subscriptions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Chart visualization coming soon
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Uploads</CardTitle>
                  <CardDescription>Upload activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Chart visualization coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Edit Role Dialog */}
      <Dialog open={editRoleDialogOpen} onOpenChange={setEditRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={isUpdatingRole}>
              {isUpdatingRole ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Role"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <ConfirmDialog
        open={deleteUserDialogOpen}
        onOpenChange={setDeleteUserDialogOpen}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone and will delete all associated data."
        confirmText={isDeletingUser ? "Deleting..." : "Delete User"}
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        variant="destructive"
      />
    </div>
  )
}


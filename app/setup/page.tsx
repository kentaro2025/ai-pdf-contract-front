import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Database, Key, FileText } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-900">Welcome to DocuMind AI</h1>
          <p className="text-lg text-gray-600">Let's get your intelligent document assistant set up</p>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-900">
            To use DocuMind AI, you need to configure Supabase for authentication, database, and file storage.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Step 1: Create Supabase Project
              </CardTitle>
              <CardDescription>Set up your backend infrastructure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>
                  Go to{" "}
                  <a
                    href="https://supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    supabase.com
                  </a>{" "}
                  and create a free account
                </li>
                <li>Create a new project</li>
                <li>Wait for the project to finish setting up</li>
                <li>Go to Project Settings → API</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Step 2: Add Environment Variables
              </CardTitle>
              <CardDescription>Connect your app to Supabase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">Add these environment variables to your project:</p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded-md text-xs font-mono space-y-1">
                <div>NEXT_PUBLIC_SUPABASE_URL=your_project_url</div>
                <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key</div>
              </div>
              <p className="text-xs text-gray-600">Find these values in your Supabase project's API settings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Step 3: Run Database Scripts
              </CardTitle>
              <CardDescription>Set up your database tables</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">Execute the SQL scripts in order:</p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>01-create-documents-table.sql</li>
                <li>02-create-qa-history-table.sql</li>
                <li>03-create-storage-bucket.sql</li>
              </ol>
              <p className="text-xs text-gray-600">Run these in the Supabase SQL Editor or use the v0 script runner</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
                Step 4: You're Ready!
              </CardTitle>
              <CardDescription>Start using DocuMind AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-700">Once configured, you'll be able to:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                <li>Create an account and sign in</li>
                <li>Upload PDF documents</li>
                <li>Ask questions about your documents</li>
                <li>View your Q&A history</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">Need Help?</h3>
              <p className="text-blue-100">
                Please visit the Supabase documentation
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

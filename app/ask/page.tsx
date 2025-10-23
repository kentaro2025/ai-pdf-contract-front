import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import AskClient from "@/components/ask-client"

export default async function AskPage({ searchParams }: { searchParams: Promise<{ document?: string }> }) {
  const supabase = await getSupabaseServerClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's documents
  const { data: documents, error: docsError } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (!documents || documents.length === 0) {
    redirect("/upload")
  }

  // Get selected document or default to first one
  const selectedDocId = params.document || documents[0].id

  // Fetch Q&A history for selected document
  const { data: qaHistory } = await supabase
    .from("qa_history")
    .select("*")
    .eq("document_id", selectedDocId)
    .order("created_at", { ascending: true })

  return (
    <AskClient
      user={user}
      documents={documents}
      selectedDocId={selectedDocId}
      initialQAHistory={qaHistory || []}
      docsError={docsError?.message}
    />
  )
}

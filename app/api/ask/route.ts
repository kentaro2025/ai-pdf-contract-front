import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, question } = await request.json()

    if (!documentId || !question) {
      return NextResponse.json({ error: "Missing documentId or question" }, { status: 400 })
    }

    // Verify document ownership
    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // -----------------------------
    // Call local backend API
    // -----------------------------
    const response = await fetch(process.env.AI_QNA_ENDPOINT + "/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    })

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`)
    }

    const data = await response.json()
    const answer = data.answer || "No answer received from backend."

    // Save Q&A to history
    const { data: qaRecord, error: qaError } = await supabase
      .from("qa_history")
      .insert({
        user_id: user.id,
        document_id: documentId,
        question,
        answer,
      })
      .select()
      .single()

    if (qaError) {
      console.error("[v0] Failed to save Q&A history:", qaError)
      // Continue even if saving fails
    }

    return NextResponse.json({
      id: qaRecord?.id || Date.now().toString(),
      answer,
    })
  } catch (error) {
    console.error("[v0] Ask error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await getSupabaseServerClient()

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the document to verify ownership and get file path
    const { data: document, error: fetchError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Extract file path from URL
    const urlParts = document.file_url.split("/documents/")
    const filePath = urlParts[urlParts.length - 1]

    // Delete from storage
    const { error: storageError } = await supabase.storage.from("documents").remove([filePath])

    if (storageError) {
      console.error("[v0] Storage deletion error:", storageError)
    }

    // Delete from database (this will cascade delete Q&A history)
    const { error: deleteError } = await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id)

    if (deleteError) {
      console.error("[v0] Database deletion error:", deleteError)
      return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Document deleted successfully" })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

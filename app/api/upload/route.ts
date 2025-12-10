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

    // Get the file from the form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("documents").upload(fileName, file, {
      contentType: "application/pdf",
      upsert: false,
    })

    if (uploadError) {
      console.error("[v0] Upload error:", uploadError)
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("documents").getPublicUrl(fileName)

    // Save document metadata to database
    const { data: documentData, error: dbError } = await supabase
      .from("documents")
      .insert({
        user_id: user.id,
        title: file.name.replace(/\.pdf$/i, ""),
        file_name: file.name,
        file_size: file.size,
        file_url: publicUrl,
      })
      .select()
      .single()

    if (dbError || !documentData) {
      console.error("[v0] Database error:", dbError)
      // Try to delete the uploaded file if database insert fails
      await supabase.storage.from("documents").remove([fileName])
      return NextResponse.json({ error: "Failed to save document metadata" }, { status: 500 })
    }

    // -----------------------------
    // Call backend API to ingest PDF into FAISS
    // -----------------------------
    try {
      // Create form data for backend upload
      const backendFormData = new FormData()
      backendFormData.append("file", file)
      backendFormData.append("user_id", user.id)
      backendFormData.append("document_id", documentData.id.toString())
      backendFormData.append("title", documentData.title || file.name.replace(/\.pdf$/i, ""))
      backendFormData.append("file_size", file.size.toString())
      backendFormData.append("file_url", publicUrl)

      const backendResponse = await fetch(process.env.AI_QNA_ENDPOINT + "/upload", {
        method: "POST",
        headers: {
          "X-User-ID": user.id, // Pass user_id via header
        },
        body: backendFormData,
      })

      if (!backendResponse.ok) {
        const backendError = await backendResponse.json().catch(() => ({ error: "Unknown error" }))
        console.error("[v0] Backend ingestion error:", backendError)
        // Don't fail the entire upload if backend ingestion fails
        // The file is already in Supabase, user can retry ingestion later
      } else {
        console.log("[v0] Backend ingestion successful")
      }
    } catch (backendError) {
      console.error("[v0] Backend ingestion request failed:", backendError)
      // Continue even if backend ingestion fails
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      documentId: documentData.id,
    })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

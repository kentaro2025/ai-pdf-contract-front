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
    const { error: dbError } = await supabase.from("documents").insert({
      user_id: user.id,
      title: file.name.replace(/\.pdf$/i, ""),
      file_name: file.name,
      file_size: file.size,
      file_url: publicUrl,
    })

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      // Try to delete the uploaded file if database insert fails
      await supabase.storage.from("documents").remove([fileName])
      return NextResponse.json({ error: "Failed to save document metadata" }, { status: 500 })
    }

    // -----------------------------
    // Call local backend API
    // -----------------------------
    const backendForm = new FormData();
    backendForm.append("file", file);

    const response = await fetch(`${process.env.AI_QNA_ENDPOINT}/upload`, {
      method: "POST",
      body: backendForm, // <-- no JSON headers here
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return NextResponse.json({ success: true, message: "File uploaded successfully" })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

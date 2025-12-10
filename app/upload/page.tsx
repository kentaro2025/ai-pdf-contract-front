import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import UploadClient from "@/components/upload-client"

export default async function UploadPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <UploadClient user={user} />
}

import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import HomeClient from "@/components/home-client"

export default async function Home() {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <HomeClient user={user} />
}

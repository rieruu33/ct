import { createClient } from "@/lib/supabase/server"
import { AdminClient } from "@/components/admin/admin-client"

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("nickname", { ascending: true })

  const { data: heroes } = await supabase
    .from("heroes")
    .select("*")
    .order("name", { ascending: true })

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false })

  return (
    <AdminClient
      players={players || []}
      heroes={heroes || []}
      tournaments={tournaments || []}
    />
  )
}

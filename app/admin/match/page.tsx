import { createClient } from "@/lib/supabase/server"
import { MatchForm } from "@/components/admin/match-form"

export const revalidate = 0

export default async function AddMatchPage() {
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
    <MatchForm
      players={players || []}
      heroes={heroes || []}
      tournaments={tournaments || []}
    />
  )
}

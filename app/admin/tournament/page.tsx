import { createClient } from "@/lib/supabase/server"
import { TournamentForm } from "@/components/admin/tournament-form"

export const revalidate = 0

export default async function AddTournamentPage() {
  const supabase = await createClient()

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("nickname", { ascending: true })

  return <TournamentForm players={players || []} />
}

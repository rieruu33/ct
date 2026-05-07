import { createClient } from "@/lib/supabase/server"
import { TournamentsClient } from "@/components/tournaments/tournaments-client"

export const revalidate = 0

export default async function TournamentsPage() {
  const supabase = await createClient()

  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false })

  // Get match counts for each tournament
  const tournamentIds = tournaments?.map(t => t.id) || []
  const { data: matchCounts } = await supabase
    .from("matches")
    .select("tournament_id")
    .in("tournament_id", tournamentIds)

  // Count matches per tournament
  const matchCountMap = new Map<number, number>()
  matchCounts?.forEach(m => {
    const current = matchCountMap.get(m.tournament_id) || 0
    matchCountMap.set(m.tournament_id, current + 1)
  })

  // Get win counts
  const { data: winCounts } = await supabase
    .from("matches")
    .select("tournament_id")
    .in("tournament_id", tournamentIds)
    .eq("is_win", true)

  const winCountMap = new Map<number, number>()
  winCounts?.forEach(m => {
    const current = winCountMap.get(m.tournament_id) || 0
    winCountMap.set(m.tournament_id, current + 1)
  })

  const tournamentsWithStats = tournaments?.map(t => ({
    ...t,
    total_matches: matchCountMap.get(t.id) || 0,
    wins: winCountMap.get(t.id) || 0,
  })) || []

  return <TournamentsClient tournaments={tournamentsWithStats} />
}

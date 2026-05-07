import { createClient } from "@/lib/supabase/server"
import { HistoryClient } from "@/components/history/history-client"

export const revalidate = 0

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function HistoryPage({ searchParams }: PageProps) {
  const { page } = await searchParams
  const currentPage = parseInt(page || "1")
  const pageSize = 10
  const offset = (currentPage - 1) * pageSize

  const supabase = await createClient()

  // Get total count
  const { count } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })

  // Get paginated matches
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      tournament:tournaments(*)
    `)
    .order("match_date", { ascending: false })
    .range(offset, offset + pageSize - 1)

  // Get match player stats for each match
  const matchIds = matches?.map(m => m.id) || []
  const { data: matchStats } = await supabase
    .from("match_player_stats")
    .select(`
      *,
      player:players(*),
      hero:heroes(*)
    `)
    .in("match_id", matchIds)

  // Get bans for each match
  const { data: bans } = await supabase
    .from("match_bans")
    .select(`
      *,
      hero:heroes(*)
    `)
    .in("match_id", matchIds)

  // Combine data
  const matchesWithDetails = matches?.map(match => ({
    ...match,
    player_stats: matchStats?.filter(s => s.match_id === match.id) || [],
    bans: bans?.filter(b => b.match_id === match.id) || [],
  })) || []

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <HistoryClient
      matches={matchesWithDetails}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  )
}

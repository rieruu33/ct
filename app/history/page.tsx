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

  // 1. Get total count
  const { count } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })

  // 2. Get paginated matches
  const { data: matches } = await supabase
    .from("matches")
    .select(`
      *,
      tournament:tournaments(*)
    `)
    .order("match_date", { ascending: false })
    .range(offset, offset + pageSize - 1)

  const matchIds = matches?.map(m => m.id) || []

  // 3. Ambil data pendukung secara paralel
  const [matchStatsRes, bansRes, opponentPicksRes] = await Promise.all([
    supabase
      .from("match_player_stats")
      .select(`*, player:players(*), hero:heroes(*)`)
      .in("match_id", matchIds),
    supabase
      .from("match_bans")
      .select(`*, hero:heroes(*)`)
      .in("match_id", matchIds),
    supabase
      .from("match_opponent_picks") // AMBIL DATA PICK MUSUH
      .select(`*, hero:heroes(*)`)
      .in("match_id", matchIds)
  ])

  const matchStats = matchStatsRes.data || []
  const bans = bansRes.data || []
  const opponentPicks = opponentPicksRes.data || []

  // 4. Gabungkan semua data ke dalam satu objek
  const matchesWithDetails = matches?.map(match => ({
    ...match,
    player_stats: matchStats.filter(s => s.match_id === match.id),
    bans: bans.filter(b => b.match_id === match.id),
    opponent_picks: opponentPicks.filter(p => p.match_id === match.id), // MASUKKAN KE SINI
  })) || []

  const totalPages = Math.ceil((count || 0) / pageSize)

  return (
    <HistoryClient
      matches={matchesWithDetails as any}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  )
}
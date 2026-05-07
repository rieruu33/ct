import { createClient } from "@/lib/supabase/server"
import { PlayerDetailClient } from "@/components/roster/player-detail-client"
import { notFound } from "next/navigation"

export const revalidate = 0

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PlayerDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch player
  const { data: player } = await supabase
    .from("players")
    .select("*")
    .eq("id", parseInt(id))
    .single()

  if (!player) {
    notFound()
  }

  // Fetch player match stats with hero and match info
  const { data: matchStats } = await supabase
    .from("match_player_stats")
    .select(`
      *,
      hero:heroes(*),
      match:matches(
        *,
        tournament:tournaments(*)
      )
    `)
    .eq("player_id", player.id)
    .order("created_at", { ascending: false })

  // FITUR BARU: Fetch turnamen yang diikuti player ini beserta detail turnamennya
  const { data: tournamentData } = await supabase
    .from("tournament_players")
    .select(`
      tournament_id,
      tournament:tournaments(*)
    `)
    .eq("player_id", player.id)

  // Hitung total turnamen dan berapa kali jadi Champion
  const tournamentCount = tournamentData?.length || 0
  const championships = tournamentData?.filter((td: any) => 
  td.tournament && (td.tournament as any).placement === "Champion"
).length || 0

  // Calculate hero pool stats
  const heroPoolMap = new Map<string, {
    hero_id: string
    hero_name: string
    hero_role: string
    total_picks: number
    wins: number
    losses: number
    mvp_count: number
  }>()

  matchStats?.forEach(stat => {
    if (stat.hero_id && stat.hero) {
      const existing = heroPoolMap.get(stat.hero_id)
      if (existing) {
        existing.total_picks++
        if (stat.is_win) existing.wins++
        else existing.losses++
        if (stat.is_mvp) existing.mvp_count++
      } else {
        heroPoolMap.set(stat.hero_id, {
          hero_id: stat.hero_id,
          hero_name: stat.hero.name,
          hero_role: stat.hero.role,
          total_picks: 1,
          wins: stat.is_win ? 1 : 0,
          losses: stat.is_win ? 0 : 1,
          mvp_count: stat.is_mvp ? 1 : 0,
        })
      }
    }
  })

  const heroPool = Array.from(heroPoolMap.values())
    .map(h => ({
      ...h,
      winrate: h.total_picks > 0 ? Math.round((h.wins / h.total_picks) * 100) : 0
    }))
    .sort((a, b) => b.total_picks - a.total_picks)

  // Calculate player stats
  const totalMatches = matchStats?.length || 0
  const wins = matchStats?.filter(m => m.is_win).length || 0
  const losses = totalMatches - wins
  const totalMvp = matchStats?.filter(m => m.is_mvp).length || 0
  const totalKills = matchStats?.reduce((sum, m) => sum + (m.kills || 0), 0) || 0
  const totalDeaths = matchStats?.reduce((sum, m) => sum + (m.deaths || 0), 0) || 0
  const totalAssists = matchStats?.reduce((sum, m) => sum + (m.assists || 0), 0) || 0

  const playerStats = {
    total_matches: totalMatches,
    wins,
    losses,
    winrate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    total_mvp: totalMvp,
    total_kills: totalKills,
    total_deaths: totalDeaths,
    total_assists: totalAssists,
    tournaments_joined: tournamentCount,
    championships: championships, // Data baru ditambahkan
  }

  // Get recent matches
  const recentMatches = matchStats?.slice(0, 10).map(stat => ({
    ...stat.match,
    hero: stat.hero,
    is_mvp: stat.is_mvp,
    kills: stat.kills,
    deaths: stat.deaths,
    assists: stat.assists,
  })) || []

  return (
    <PlayerDetailClient
      player={player}
      playerStats={playerStats as any} // Di-cast ke any untuk menghindari error typescript sementara
      heroPool={heroPool}
      recentMatches={recentMatches}
    />
  )
}
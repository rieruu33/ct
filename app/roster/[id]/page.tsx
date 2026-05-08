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

  // PERBAIKAN BUG: Ambil data tanpa limit di server, urutkan di memori nanti jika perlu
  // tapi kueri ini akan mengambil data terbaru berdasarkan id (created_at)
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
    // Kita hapus order by created_at karena kita akan urutkan berdasarkan match_date di logic bawah

  // Fetch turnamen
  const { data: tournamentData } = await supabase
    .from("tournament_players")
    .select(`
      tournament_id,
      tournament:tournaments(*)
    `)
    .eq("player_id", player.id)

  const tournamentCount = tournamentData?.length || 0
  const championships = tournamentData?.filter((td: any) => 
    td.tournament && (td.tournament as any).placement === "Champion"
  ).length || 0

  // Calculate hero pool stats
  const heroPoolMap = new Map<string, any>()
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
  
  const playerStats = {
    total_matches: totalMatches,
    wins,
    losses,
    winrate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0,
    total_mvp: matchStats?.filter(m => m.is_mvp).length || 0,
    total_kills: matchStats?.reduce((sum, m) => sum + (m.kills || 0), 0) || 0,
    total_deaths: matchStats?.reduce((sum, m) => sum + (m.deaths || 0), 0) || 0,
    total_assists: matchStats?.reduce((sum, m) => sum + (m.assists || 0), 0) || 0,
    tournaments_joined: tournamentCount,
    championships: championships,
  }

  // PERBAIKAN BUG: Urutkan semua match berdasarkan TANGGAL PERTANDINGAN (terbaru di atas)
  const allMatches = matchStats ? [...matchStats].sort((a, b) => {
    return new Date(b.match?.match_date).getTime() - new Date(a.match?.match_date).getTime()
  }).map(stat => ({
    ...stat.match,
    hero: stat.hero,
    is_mvp: stat.is_mvp,
    kills: stat.kills,
    deaths: stat.deaths,
    assists: stat.assists,
  })) : []

  return (
    <PlayerDetailClient
      player={player}
      playerStats={playerStats as any}
      heroPool={heroPool}
      recentMatches={allMatches} // Kirim semua data untuk dipagination di client
    />
  )
}
import { createClient } from "@/lib/supabase/server"
import { StatsClient } from "@/components/stats/stats-client"

export const revalidate = 0

export default async function StatsPage({ searchParams }: { searchParams: Promise<{ startDate?: string }> }) {
  const resolvedParams = await searchParams
  const startDate = resolvedParams.startDate || "2026-04-09"

  const supabase = await createClient()

  // 1. Ambil SEMUA data
  const [matchesRes, matchStatsRes, bansRes, tournamentsRes, financesRes, opponentPicksRes] = await Promise.all([
    supabase.from("matches").select("*"),
    supabase.from("match_player_stats").select(`*, hero:heroes(*), player:players(*)`),
    supabase.from("match_bans").select(`*, hero:heroes(*)`),
    supabase.from("tournaments").select("*"),
    supabase.from("finances").select("*"),
    supabase.from("match_opponent_picks").select(`*, hero:heroes(*)`) 
  ])

  const allMatches = matchesRes.data || []
  const allMatchStats = matchStatsRes.data || []
  const allBans = bansRes.data || []
  const allOpponentPicks = opponentPicksRes.data || []
  const tournaments = tournamentsRes.data || []
  const finances = financesRes.data || []

  // --- STATISTIK GLOBAL ---
  const totalMatches = allMatches.length
  const wins = allMatches.filter(m => m.is_win).length
  const losses = totalMatches - wins
  const winrate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0

  const totalTournaments = tournaments.length
  const completedTournaments = tournaments.filter(t => t.status === "completed").length
  
  const totalPrize = finances
    ?.filter(f => f.type === "income" && f.description !== "INITIAL_BALANCE")
    .reduce((sum, f) => sum + Number(f.amount), 0) || 0
  const championships = tournaments.filter(t => t.placement === "Champion").length

  // --- FILTER KHUSUS DRAFTING & BANS (Berdasarkan StartDate) ---
  const filteredMatches = allMatches.filter(m => m.match_date >= startDate + "T00:00:00")
  const filteredMatchIds = filteredMatches.map(m => m.id)
  const filteredBans = allBans.filter(b => filteredMatchIds.includes(b.match_id))
  const filteredOpponentPicks = allOpponentPicks.filter(p => filteredMatchIds.includes(p.match_id))

  // Calculate Draft Stats
  const firstPickMatches = filteredMatches.filter(m => m.is_first_pick)
  const secondPickMatches = filteredMatches.filter(m => !m.is_first_pick)

  const draftStats = {
    firstPick: {
      matches: firstPickMatches.length,
      wins: firstPickMatches.filter(m => m.is_win).length,
      winrate: firstPickMatches.length > 0 ? Math.round((firstPickMatches.filter(m => m.is_win).length / firstPickMatches.length) * 100) : 0
    },
    secondPick: {
      matches: secondPickMatches.length,
      wins: secondPickMatches.filter(m => m.is_win).length,
      winrate: secondPickMatches.length > 0 ? Math.round((secondPickMatches.filter(m => m.is_win).length / secondPickMatches.length) * 100) : 0
    }
  }

  // Calculate Ban Stats
  const getTopBans = (isOurBan: boolean, isFirstPick: boolean) => {
    const map = new Map<string, { hero: any, count: number }>()
    filteredBans.forEach(b => {
      const match = filteredMatches.find(m => m.id === b.match_id)
      if (match && b.is_our_ban === isOurBan && match.is_first_pick === isFirstPick) {
        const existing = map.get(b.hero_id) || { hero: b.hero, count: 0 }
        existing.count++
        map.set(b.hero_id, existing)
      }
    })
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5).map(item => ({
      id: item.hero.id, name: item.hero.name, role: item.hero.role, count: item.count
    }))
  }

  const banStats = {
    ourFirstPick: getTopBans(true, true),
    ourSecondPick: getTopBans(true, false),
    enemyFirstPick: getTopBans(false, true),
    enemySecondPick: getTopBans(false, false)
  }

  // --- ANALISIS HERO MUSUH ---
  const enemyHeroMap = new Map<string, { hero: any, total: number, enemyWins: number }>()
  
  filteredOpponentPicks.forEach(pick => {
    const match = filteredMatches.find(m => m.id === pick.match_id)
    if (match && pick.hero) {
      const existing = enemyHeroMap.get(pick.hero_id) || { hero: pick.hero, total: 0, enemyWins: 0 }
      existing.total++
      if (!match.is_win) existing.enemyWins++
      enemyHeroMap.set(pick.hero_id, existing)
    }
  })

  const enemyStats = Array.from(enemyHeroMap.values()).map(item => ({
    id: item.hero.id,
    name: item.hero.name,
    role: item.hero.role,
    total: item.total,
    enemyWinrate: Math.round((item.enemyWins / item.total) * 100)
  }))

  // MENGHAPUS SLICE: Kirim semua data agar bisa dipagination di Client
  const enemyMostPicked = [...enemyStats].sort((a, b) => b.total - a.total)
  const enemyKryptonite = [...enemyStats]
    .sort((a, b) => b.enemyWinrate - a.enemyWinrate || b.total - a.total)

  // --- HERO & PLAYER STATS (ALL TIME) ---
  const heroPickMap = new Map<string, { picks: number; wins: number; name: string; role: string }>()
  allMatchStats.forEach(stat => {
    if (stat.hero_id && stat.hero) {
      const existing = heroPickMap.get(stat.hero_id) || { picks: 0, wins: 0, name: stat.hero.name, role: stat.hero.role }
      existing.picks++
      if (stat.is_win) existing.wins++
      heroPickMap.set(stat.hero_id, existing)
    }
  })

  const heroStats = Array.from(heroPickMap.entries()).map(([id, data]) => ({
    id, name: data.name, role: data.role, picks: data.picks, wins: data.wins,
    winrate: data.picks > 0 ? Math.round((data.wins / data.picks) * 100) : 0,
  }))

  const playerStatsMap = new Map<number, any>()
  allMatchStats.forEach(stat => {
    if (stat.player) {
      const existing = playerStatsMap.get(stat.player_id) || { id: stat.player_id, nickname: stat.player.nickname, matches: 0, wins: 0, mvps: 0, kills: 0, deaths: 0, assists: 0 }
      existing.matches++
      if (stat.is_win) existing.wins++
      if (stat.is_mvp) existing.mvps++
      existing.kills += stat.kills || 0; existing.deaths += stat.deaths || 0; existing.assists += stat.assists || 0
      playerStatsMap.set(stat.player_id, existing)
    }
  })

  const playerStatsArr = Array.from(playerStatsMap.values()).map(p => ({
    ...p,
    winrate: p.matches > 0 ? Math.round((p.wins / p.matches) * 100) : 0,
    kda: p.deaths > 0 ? ((p.kills + p.assists) / p.deaths).toFixed(2) : (p.kills + p.assists).toFixed(2),
  }))

  return (
    <StatsClient
      startDate={startDate}
      teamStats={{
        total_matches: totalMatches, wins, losses, winrate,
        total_tournaments: totalTournaments, 
        completed_tournaments: completedTournaments,
        total_prize: totalPrize, championships,
      }}
      draftStats={draftStats}
      banStats={banStats}
      enemyMostPicked={enemyMostPicked}
      enemyKryptonite={enemyKryptonite}
      mostPickedHeroes={[...heroStats].sort((a, b) => b.picks - a.picks)}
      bestWinrateHeroes={[...heroStats].sort((a, b) => b.winrate - a.winrate || b.picks - a.picks)}
      topMvpPlayers={[...playerStatsArr].sort((a, b) => b.mvps - a.mvps)}
      topWinratePlayers={[...playerStatsArr].sort((a, b) => b.winrate - a.winrate || b.matches - a.matches)}
    />
  )
}
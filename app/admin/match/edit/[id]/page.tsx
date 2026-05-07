"use client"

import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { MatchForm } from "@/components/admin/match-form"
import { Player, Hero, Tournament } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EditMatchPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params dengan use() untuk Next.js 15+
  const resolvedParams = use(params)
  const matchId = resolvedParams.id

  const [initialData, setInitialData] = useState<any>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatchData = async () => {
      if (!matchId) return
      const supabase = createClient()
      
      try {
        setLoading(true)

        // Kita jalankan semua fetch data secara paralel agar lebih cepat
        const [
          matchRes, 
          statsRes, 
          bansRes, 
          picksRes,
          playersRes,
          heroesRes,
          tournamentsRes
        ] = await Promise.all([
          supabase.from("matches").select("*").eq("id", parseInt(matchId)).single(),
          supabase.from("match_player_stats").select("*").eq("match_id", parseInt(matchId)),
          supabase.from("match_bans").select("*").eq("match_id", parseInt(matchId)),
          supabase.from("match_opponent_picks").select("*").eq("match_id", parseInt(matchId)),
          supabase.from("players").select("*"),
          supabase.from("heroes").select("*").order("name"),
          supabase.from("tournaments").select("*").order("start_date", { ascending: false })
        ])

        if (matchRes.error) throw matchRes.error

        // Memisahkan data bans menjadi ban kita dan ban musuh
        const our_bans = bansRes.data?.filter(b => b.is_our_ban).map(b => b.hero_id) || []
        const enemy_bans = bansRes.data?.filter(b => !b.is_our_ban).map(b => b.hero_id) || []
        const enemy_picks = picksRes.data?.map(p => p.hero_id) || []

        setPlayers(playersRes.data || [])
        setHeroes(heroesRes.data || [])
        setTournaments(tournamentsRes.data || [])

        // Menggabungkan semua data menjadi satu object initialData
        setInitialData({
          ...matchRes.data,
          player_stats: statsRes.data || [],
          our_bans,
          enemy_bans,
          enemy_picks,
        })

      } catch (err: any) {
        console.error("Error fetching match:", err)
        setError("Gagal memuat data pertandingan.")
      } finally {
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [matchId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Memuat data pertandingan...</p>
      </div>
    )
  }

  if (error || !initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        {error || "Match not found."}
      </div>
    )
  }

  return (
    <MatchForm 
      players={players} 
      heroes={heroes} 
      tournaments={tournaments} 
      initialData={initialData} 
    />
  )
}
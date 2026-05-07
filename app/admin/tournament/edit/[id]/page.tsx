"use client"

// 1. Tambahkan import `use` dari "react"
import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { TournamentForm } from "@/components/admin/tournament-form"
import { Player } from "@/lib/types"
import { Loader2 } from "lucide-react"

// 2. Tipe params kita ubah menjadi Promise
export default function EditTournamentPage({ params }: { params: Promise<{ id: string }> }) {
  // 3. Kita unwrap params menggunakan `use()`
  const resolvedParams = use(params)
  const tournamentId = resolvedParams.id

  const [initialData, setInitialData] = useState<any>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTournamentData = async () => {
      // Pastikan ID ada sebelum melakukan fetch
      if (!tournamentId) return

      const supabase = createClient()
      
      try {
        setLoading(true)
        setError(null)

        // Ambil data turnamen menggunakan ID yang sudah di-unwrap
        const { data: tournament, error: tournamentError } = await supabase
          .from("tournaments")
          .select("*")
          .eq("id", parseInt(tournamentId)) // Pastikan parse ke integer untuk menghindari error 22P02
          .single()

        if (tournamentError) {
           console.error("Supabase Error (Tournament):", tournamentError)
           throw new Error("Gagal mengambil data turnamen.")
        }

        // Ambil data relasi pemain
        const { data: tournamentPlayers, error: playersError } = await supabase
          .from("tournament_players")
          .select("player_id")
          .eq("tournament_id", parseInt(tournamentId))

        if (playersError) {
          console.error("Supabase Error (Tournament Players):", playersError)
        }

        const selected_players = tournamentPlayers?.map((tp: any) => tp.player_id) || []

        // Ambil data semua pemain untuk pilihan
        const { data: allPlayers, error: allPlayersError } = await supabase
          .from("players")
          .select("*")

        if (allPlayersError) {
          console.error("Supabase Error (All Players):", allPlayersError)
        }

        setPlayers(allPlayers || [])
        setInitialData({
          ...tournament,
          selected_players,
        })
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Terjadi kesalahan saat memuat data.")
      } finally {
        setLoading(false)
      }
    }

    fetchTournamentData()
  }, [tournamentId]) // Gunakan ID yang sudah di-unwrap sebagai dependency

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Memuat data turnamen...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        {error}
      </div>
    )
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
        Tournament not found.
      </div>
    )
  }

  return <TournamentForm players={players} initialData={initialData} />
}
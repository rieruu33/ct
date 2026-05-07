"use client"

import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { PlayerForm } from "@/components/admin/player-form"
import { Loader2 } from "lucide-react"

export default function EditPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  // Gunakan React.use() untuk ekstrak ID persis seperti Turnamen & Match
  const resolvedParams = use(params)
  const playerId = resolvedParams.id

  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!playerId) return
      const supabase = createClient()

      try {
        setLoading(true)
        setError(null)

        const { data: player, error: playerError } = await supabase
          .from("players")
          .select("*")
          .eq("id", parseInt(playerId))
          .single()

        if (playerError) throw playerError

        setInitialData(player)
      } catch (err: any) {
        console.error("Error fetching player:", err)
        setError("Gagal memuat data pemain.")
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [playerId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Memuat data pemain...</p>
      </div>
    )
  }

  if (error || !initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        {error || "Player not found."}
      </div>
    )
  }

  return <PlayerForm initialData={initialData} />
}
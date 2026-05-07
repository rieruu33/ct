"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Player } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Trophy, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface TournamentFormProps {
  players: Player[]
  initialData?: any // Prop baru untuk menampung data lama
}

export function TournamentForm({ players, initialData }: TournamentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cek apakah ini mode Edit
  const isEdit = !!initialData

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    organizer: initialData?.organizer || "",
    bracket_url: initialData?.bracket_url || "",
    start_date: initialData?.start_date || "",
    end_date: initialData?.end_date || "",
    registration_fee: initialData?.registration_fee?.toString() || "",
    prize_won: initialData?.prize_won?.toString() || "",
    placement: initialData?.placement || "",
    status: initialData?.status || "upcoming",
    selected_players: initialData?.selected_players || ([] as number[]),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const payload = {
        name: formData.name,
        organizer: formData.organizer,
        bracket_url: formData.bracket_url || null,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        registration_fee: parseFloat(formData.registration_fee) || 0,
        prize_won: parseFloat(formData.prize_won) || 0,
        placement: formData.placement || null,
        status: formData.status,
      }

      let tournamentId = null

      if (isEdit) {
        // --- MODE EDIT (UPDATE) ---
        const { error: updateError } = await supabase
          .from("tournaments")
          .update(payload)
          .eq("id", initialData.id)

        if (updateError) throw updateError
        tournamentId = initialData.id

        // Hapus data pemain lama di turnamen ini (nanti di-insert ulang)
        await supabase.from("tournament_players").delete().eq("tournament_id", tournamentId)
      } else {
        // --- MODE ADD (INSERT) ---
        const { data: tournament, error: insertError } = await supabase
          .from("tournaments")
          .insert(payload)
          .select()
          .single()

        if (insertError) throw insertError
        tournamentId = tournament.id

        // Catatan Keuangan (Hanya dicatat saat turnamen baru dibuat)
        if (payload.registration_fee > 0) {
          await supabase.from("finances").insert({
            tournament_id: tournamentId,
            type: "expense",
            amount: payload.registration_fee,
            description: `Registration fee - ${payload.name}`,
            transaction_date: payload.start_date,
          })
        }
        if (payload.prize_won > 0) {
          await supabase.from("finances").insert({
            tournament_id: tournamentId,
            type: "income",
            amount: payload.prize_won,
            description: `Prize money - ${payload.name} (${payload.placement || "Participated"})`,
            transaction_date: payload.end_date || payload.start_date,
          })
        }
      }

      // Insert ulang pemain yang ikut turnamen (Berlaku untuk Add dan Edit)
      if (formData.selected_players.length > 0 && tournamentId) {
        // PERBAIKAN TS: Tambahkan (playerId: number)
        const playerInserts = formData.selected_players.map((playerId: number) => ({
          tournament_id: tournamentId,
          player_id: playerId,
        }))

        const { error: playersError } = await supabase
          .from("tournament_players")
          .insert(playerInserts)

        if (playersError) throw playersError
      }

      router.push("/admin/manage")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to save tournament")
    } finally {
      setLoading(false)
    }
  }

  const togglePlayer = (playerId: number) => {
    setFormData(prev => ({
      ...prev,
      selected_players: prev.selected_players.includes(playerId)
        // PERBAIKAN TS: Tambahkan (id: number)
        ? prev.selected_players.filter((id: number) => id !== playerId)
        : [...prev.selected_players, playerId],
    }))
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 max-w-2xl">
      <Link 
        href="/admin/manage" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Manage
      </Link>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {isEdit ? "Edit Tournament" : "Add New Tournament"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Tournament Name *</label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., MLBB Cup 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Organizer *</label>
              <Input
                required
                value={formData.organizer}
                onChange={e => setFormData(prev => ({ ...prev, organizer: e.target.value }))}
                placeholder="e.g., Moonton"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Bracket URL</label>
              <Input
                type="url"
                value={formData.bracket_url}
                onChange={e => setFormData(prev => ({ ...prev, bracket_url: e.target.value }))}
                placeholder="https://challonge.com/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Start Date *</label>
                <Input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={e => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={e => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Registration Fee (Rp)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.registration_fee}
                  onChange={e => setFormData(prev => ({ ...prev, registration_fee: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Prize Won (Rp)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.prize_won}
                  onChange={e => setFormData(prev => ({ ...prev, prize_won: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Placement</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={formData.placement}
                  onChange={e => setFormData(prev => ({ ...prev, placement: e.target.value }))}
                >
                  <option value="">Select placement</option>
                  <option value="Champion">Champion</option>
                  <option value="Runner-up">Runner-up</option>
                  <option value="Top 4">Top 4</option>
                  <option value="Top 8">Top 8</option>
                  <option value="Top 16">Top 16</option>
                  <option value="Eliminated">Eliminated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Status *</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Participating Players</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {players.map(player => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => togglePlayer(player.id)}
                    className={`p-3 rounded-xl text-sm font-medium transition-colors ${
                      formData.selected_players.includes(player.id)
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {player.nickname}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Update Tournament"
              ) : (
                "Add Tournament"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
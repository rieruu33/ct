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
}

export function TournamentForm({ players }: TournamentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    organizer: "",
    bracket_url: "",
    start_date: "",
    end_date: "",
    registration_fee: "",
    prize_won: "",
    placement: "",
    status: "upcoming",
    selected_players: [] as number[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Insert tournament
      const { data: tournament, error: tournamentError } = await supabase
        .from("tournaments")
        .insert({
          name: formData.name,
          organizer: formData.organizer,
          bracket_url: formData.bracket_url || null,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          registration_fee: parseFloat(formData.registration_fee) || 0,
          prize_won: parseFloat(formData.prize_won) || 0,
          placement: formData.placement || null,
          status: formData.status,
        })
        .select()
        .single()

      if (tournamentError) throw tournamentError

      // Insert tournament players
      if (formData.selected_players.length > 0 && tournament) {
        const playerInserts = formData.selected_players.map(playerId => ({
          tournament_id: tournament.id,
          player_id: playerId,
        }))

        const { error: playersError } = await supabase
          .from("tournament_players")
          .insert(playerInserts)

        if (playersError) throw playersError
      }

      // Insert finance record for registration fee
      if (parseFloat(formData.registration_fee) > 0 && tournament) {
        await supabase.from("finances").insert({
          tournament_id: tournament.id,
          type: "expense",
          amount: parseFloat(formData.registration_fee),
          description: `Registration fee - ${formData.name}`,
          transaction_date: formData.start_date,
        })
      }

      // Insert finance record for prize won
      if (parseFloat(formData.prize_won) > 0 && tournament) {
        await supabase.from("finances").insert({
          tournament_id: tournament.id,
          type: "income",
          amount: parseFloat(formData.prize_won),
          description: `Prize money - ${formData.name} (${formData.placement || "Participated"})`,
          transaction_date: formData.end_date || formData.start_date,
        })
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to add tournament")
    } finally {
      setLoading(false)
    }
  }

  const togglePlayer = (playerId: number) => {
    setFormData(prev => ({
      ...prev,
      selected_players: prev.selected_players.includes(playerId)
        ? prev.selected_players.filter(id => id !== playerId)
        : [...prev.selected_players, playerId],
    }))
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 max-w-2xl">
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <Card className="shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Add New Tournament
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
                  Adding Tournament...
                </>
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { Player, Hero, Tournament } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Swords, Loader2, Plus, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface MatchFormProps {
  players: Player[]
  heroes: Hero[]
  tournaments: Tournament[]
}

interface PlayerStatInput {
  player_id: number
  hero_id: string
  is_mvp: boolean
  kills: number
  deaths: number
  assists: number
}

export function MatchForm({ players, heroes, tournaments }: MatchFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    tournament_id: "",
    opponent_name: "",
    match_date: "",
    match_time: "",
    is_win: true,
    our_score: "0",
    opponent_score: "0",
    notes: "",
  })

  // State baru untuk menyimpan file gambar yang diupload
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null)

  const [playerStats, setPlayerStats] = useState<PlayerStatInput[]>([])
  const [ourBans, setOurBans] = useState<string[]>([])
  const [enemyBans, setEnemyBans] = useState<string[]>([])
  const [enemyPicks, setEnemyPicks] = useState<string[]>([])

  const addPlayerStat = () => {
    if (players.length > 0) {
      setPlayerStats([...playerStats, {
        player_id: players[0].id,
        hero_id: heroes[0]?.id || "",
        is_mvp: false,
        kills: 0,
        deaths: 0,
        assists: 0,
      }])
    }
  }

  const removePlayerStat = (index: number) => {
    setPlayerStats(playerStats.filter((_, i) => i !== index))
  }

  const updatePlayerStat = (index: number, field: keyof PlayerStatInput, value: any) => {
    const updated = [...playerStats]
    updated[index] = { ...updated[index], [field]: value }
    // If setting MVP, unset others
    if (field === "is_mvp" && value === true) {
      updated.forEach((stat, i) => {
        if (i !== index) stat.is_mvp = false
      })
    }
    setPlayerStats(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const matchDateTime = `${formData.match_date}T${formData.match_time || "00:00"}:00`

      let finalScreenshotUrl = null

      // Logika untuk upload gambar ke Supabase Storage
      if (screenshotFile) {
        // Buat nama file unik agar tidak bentrok
        const fileExt = screenshotFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(fileName, screenshotFile)

        if (uploadError) {
          throw new Error(`Gagal upload gambar: ${uploadError.message}`)
        }

        // Ambil Public URL dari gambar yang baru diupload
        const { data: publicUrlData } = supabase.storage
          .from('screenshots')
          .getPublicUrl(fileName)

        finalScreenshotUrl = publicUrlData.publicUrl
      }

      // Insert match (sekarang menggunakan finalScreenshotUrl)
      const { data: match, error: matchError } = await supabase
        .from("matches")
        .insert({
          tournament_id: formData.tournament_id ? parseInt(formData.tournament_id) : null,
          opponent_name: formData.opponent_name,
          match_date: matchDateTime,
          is_win: formData.is_win,
          our_score: parseInt(formData.our_score) || 0,
          opponent_score: parseInt(formData.opponent_score) || 0,
          screenshot_url: finalScreenshotUrl,
          notes: formData.notes || null,
        })
        .select()
        .single()

      if (matchError) throw matchError

      // Insert player stats
      if (playerStats.length > 0 && match) {
        const statsInserts = playerStats.map(stat => ({
          match_id: match.id,
          player_id: stat.player_id,
          hero_id: stat.hero_id,
          is_mvp: stat.is_mvp,
          is_win: formData.is_win,
          kills: stat.kills,
          deaths: stat.deaths,
          assists: stat.assists,
        }))

        const { error: statsError } = await supabase
          .from("match_player_stats")
          .insert(statsInserts)

        if (statsError) throw statsError
      }

      // Insert our bans
      if (ourBans.length > 0 && match) {
        const banInserts = ourBans.filter(b => b).map(heroId => ({
          match_id: match.id,
          hero_id: heroId,
          is_our_ban: true,
        }))

        if (banInserts.length > 0) {
          await supabase.from("match_bans").insert(banInserts)
        }
      }

      // Insert enemy bans
      if (enemyBans.length > 0 && match) {
        const banInserts = enemyBans.filter(b => b).map(heroId => ({
          match_id: match.id,
          hero_id: heroId,
          is_our_ban: false,
        }))

        if (banInserts.length > 0) {
          await supabase.from("match_bans").insert(banInserts)
        }
      }

      // Insert enemy picks
      if (enemyPicks.length > 0 && match) {
        const pickInserts = enemyPicks.filter(p => p).map(heroId => ({
          match_id: match.id,
          hero_id: heroId,
        }))

        if (pickInserts.length > 0) {
          await supabase.from("match_opponent_picks").insert(pickInserts)
        }
      }

      router.push("/admin")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to add match")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8 max-w-3xl">
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
            <Swords className="h-5 w-5" />
            Add New Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Match Info */}
            <div className="space-y-4">
              <h3 className="font-medium">Match Information</h3>
              
              <div>
                <label className="block text-sm font-medium mb-1.5">Tournament</label>
                <select
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  value={formData.tournament_id}
                  onChange={e => setFormData(prev => ({ ...prev, tournament_id: e.target.value }))}
                >
                  <option value="">Select tournament (optional)</option>
                  {tournaments.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Opponent Name *</label>
                <Input
                  required
                  value={formData.opponent_name}
                  onChange={e => setFormData(prev => ({ ...prev, opponent_name: e.target.value }))}
                  placeholder="e.g., Team Alpha"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Match Date *</label>
                  <Input
                    type="date"
                    required
                    value={formData.match_date}
                    onChange={e => setFormData(prev => ({ ...prev, match_date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Match Time</label>
                  <Input
                    type="time"
                    value={formData.match_time}
                    onChange={e => setFormData(prev => ({ ...prev, match_time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Result *</label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={formData.is_win ? "win" : "loss"}
                    onChange={e => setFormData(prev => ({ ...prev, is_win: e.target.value === "win" }))}
                  >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Our Score</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.our_score}
                    onChange={e => setFormData(prev => ({ ...prev, our_score: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Opponent Score</label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.opponent_score}
                    onChange={e => setFormData(prev => ({ ...prev, opponent_score: e.target.value }))}
                  />
                </div>
              </div>

              {/* Perubahan Input Upload Gambar di sini */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Upload Screenshot Match</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0] || null
                    setScreenshotFile(file)
                  }}
                  className="cursor-pointer"
                />
                {screenshotFile && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Upload className="w-3 h-3" /> {screenshotFile.name} siap diupload.
                  </p>
                )}
              </div>
            </div>

            {/* Player Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Player Stats</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPlayerStat}>
                  <Plus className="h-4 w-4 mr-1" /> Add Player
                </Button>
              </div>

              {playerStats.map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-muted/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Player {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removePlayerStat(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs mb-1">Player</label>
                      <select
                        className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                        value={stat.player_id}
                        onChange={e => updatePlayerStat(index, "player_id", parseInt(e.target.value))}
                      >
                        {players.map(p => (
                          <option key={p.id} value={p.id}>{p.nickname}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Hero</label>
                      <select
                        className="w-full h-9 px-2 rounded-md border border-input bg-background text-sm"
                        value={stat.hero_id}
                        onChange={e => updatePlayerStat(index, "hero_id", e.target.value)}
                      >
                        {heroes.map(h => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs mb-1">Kills</label>
                      <Input
                        type="number"
                        min="0"
                        className="h-9"
                        value={stat.kills}
                        onChange={e => updatePlayerStat(index, "kills", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Deaths</label>
                      <Input
                        type="number"
                        min="0"
                        className="h-9"
                        value={stat.deaths}
                        onChange={e => updatePlayerStat(index, "deaths", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Assists</label>
                      <Input
                        type="number"
                        min="0"
                        className="h-9"
                        value={stat.assists}
                        onChange={e => updatePlayerStat(index, "assists", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => updatePlayerStat(index, "is_mvp", !stat.is_mvp)}
                        className={`w-full h-9 rounded-md text-sm font-medium transition-colors ${
                          stat.is_mvp
                            ? "bg-yellow-500 text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        MVP
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bans & Picks */}
            <div className="space-y-4">
              <h3 className="font-medium">Bans & Picks</h3>
              
              <div>
                <label className="block text-sm font-medium mb-2">Our Bans (select up to 5)</label>
                <div className="flex flex-wrap gap-2">
                  {heroes.map(hero => (
                    <button
                      key={hero.id}
                      type="button"
                      onClick={() => {
                        if (ourBans.includes(hero.id)) {
                          setOurBans(ourBans.filter(b => b !== hero.id))
                        } else if (ourBans.length < 5) {
                          setOurBans([...ourBans, hero.id])
                        }
                      }}
                      className={`w-10 h-10 rounded-lg overflow-hidden relative ${
                        ourBans.includes(hero.id) ? "ring-2 ring-red-500" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={`/heroes/${hero.id}.png`}
                        alt={hero.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enemy Bans (select up to 5)</label>
                <div className="flex flex-wrap gap-2">
                  {heroes.map(hero => (
                    <button
                      key={hero.id}
                      type="button"
                      onClick={() => {
                        if (enemyBans.includes(hero.id)) {
                          setEnemyBans(enemyBans.filter(b => b !== hero.id))
                        } else if (enemyBans.length < 5) {
                          setEnemyBans([...enemyBans, hero.id])
                        }
                      }}
                      className={`w-10 h-10 rounded-lg overflow-hidden relative ${
                        enemyBans.includes(hero.id) ? "ring-2 ring-blue-500" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={`/heroes/${hero.id}.png`}
                        alt={hero.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Enemy Picks (select up to 5)</label>
                <div className="flex flex-wrap gap-2">
                  {heroes.map(hero => (
                    <button
                      key={hero.id}
                      type="button"
                      onClick={() => {
                        if (enemyPicks.includes(hero.id)) {
                          setEnemyPicks(enemyPicks.filter(p => p !== hero.id))
                        } else if (enemyPicks.length < 5) {
                          setEnemyPicks([...enemyPicks, hero.id])
                        }
                      }}
                      className={`w-10 h-10 rounded-lg overflow-hidden relative ${
                        enemyPicks.includes(hero.id) ? "ring-2 ring-green-500" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={`/heroes/${hero.id}.png`}
                        alt={hero.name}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
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
                  Adding Match...
                </>
              ) : (
                "Add Match"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
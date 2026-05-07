"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Player, PlayerStats, HeroPoolStat } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Instagram, Trophy, Target, Skull, Users, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"

interface PlayerDetailClientProps {
  player: Player
  playerStats: PlayerStats
  heroPool: HeroPoolStat[]
  recentMatches: any[]
}

const roleColors: Record<string, string> = {
  "Gold Laner": "bg-yellow-500/10 text-yellow-700",
  "EXP Laner": "bg-purple-500/10 text-purple-700",
  "Mid Laner": "bg-blue-500/10 text-blue-700",
  "Roamer": "bg-green-500/10 text-green-700",
  "Jungler": "bg-red-500/10 text-red-700",
}

export function PlayerDetailClient({ player, playerStats, heroPool, recentMatches }: PlayerDetailClientProps) {
  const signatureHero = heroPool[0]
  const otherHeroes = heroPool.slice(1, 6)

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <Link 
        href="/roster" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Roster
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Photo & Info */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-0 overflow-hidden">
            <div className="aspect-[3/4] relative bg-muted">
              {player.photo_filename ? (
                <Image
                  src={`/players/${player.photo_filename}`}
                  alt={player.nickname}
                  fill
                  priority // TAMBAHKAN INI AGAR LOADING CEPAT
                  // UBAH 'object-cover' MENJADI 'object-cover object-[center_15%]'
                  className="object-cover object-[center_15%]" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                  <span className="text-8xl font-bold text-muted-foreground/30">
                    {player.nickname.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold">{player.nickname}</h1>
              <p className="text-muted-foreground">{player.full_name}</p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${roleColors[player.role] || "bg-gray-500/10 text-gray-700"}`}>
                {player.role}
              </span>
              
              <div className="mt-6 space-y-3 text-sm">
                {player.team_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Team ID</span>
                    <span className="font-medium">{player.team_id}</span>
                  </div>
                )}
                {player.ingame_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">In-Game ID</span>
                    <span className="font-medium">{player.ingame_id}</span>
                  </div>
                )}
              </div>

              {player.instagram_url && (
                <a
                  href={player.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats & Hero Pool */}
        <div className="lg:col-span-2 space-y-6">
          {/* Signature Hero (VERSI DIPERBESAR) */}
          {signatureHero && (
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Most Picked Hero (Signature)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-center">
                  
                  {/* Kotak Gambar Diperbesar (w-40 h-40) */}
                  <div className="w-40 h-40 relative rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm border border-muted/20">
                    <Image
                      src={`/heroes/${signatureHero.hero_id}.png`}
                      alt={signatureHero.hero_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Bagian Teks & Statistik */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="text-3xl font-bold tracking-tight">{signatureHero.hero_name}</h3>
                    <Badge variant="secondary" className="mt-2 mb-4 text-sm px-3 py-0.5">{signatureHero.hero_role}</Badge>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2 pt-6 border-t border-muted/60">
                      <div>
                        <p className="text-3xl font-bold">{signatureHero.total_picks}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">Picks</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-green-600">{signatureHero.winrate}%</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">Winrate</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{signatureHero.wins}W - {signatureHero.losses}L</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">Record</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-yellow-600">{signatureHero.mvp_count}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-1">MVP</p>
                      </div>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Hero Pools */}
          {otherHeroes.length > 0 && (
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Other Hero Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {otherHeroes.map((hero, index) => (
                    <motion.div
                      key={hero.hero_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex flex-col items-center gap-2 shrink-0"
                    >
                      <div className="w-16 h-16 relative rounded-full overflow-hidden bg-muted">
                        <Image
                          src={`/heroes/${hero.hero_id}.png`}
                          alt={hero.hero_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">{hero.hero_name}</p>
                        <p className="text-xs text-muted-foreground">{hero.total_picks} picks</p>
                        <p className="text-xs text-green-600">{hero.winrate}% WR</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Player Statistics */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Player Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Trophy className="h-5 w-5 mx-auto mb-2 text-yellow-600" />
                  <p className="text-2xl font-bold">{playerStats.tournaments_joined}</p>
                  <p className="text-xs text-muted-foreground">Tournaments</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Target className="h-5 w-5 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{playerStats.total_matches}</p>
                  <p className="text-xs text-muted-foreground">Matches</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <p className="text-2xl font-bold text-green-600">{playerStats.winrate}%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                  <p className="text-xs text-muted-foreground">{playerStats.wins}W - {playerStats.losses}L</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/50 text-center">
                  <Star className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                  <p className="text-2xl font-bold">{playerStats.total_mvp}</p>
                  <p className="text-xs text-muted-foreground">MVP</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-xl bg-green-50 text-center">
                  <p className="text-xl font-bold text-green-700">{playerStats.total_kills}</p>
                  <p className="text-xs text-green-600">Kills</p>
                </div>
                <div className="p-4 rounded-xl bg-red-50 text-center">
                  <p className="text-xl font-bold text-red-700">{playerStats.total_deaths}</p>
                  <p className="text-xs text-red-600">Deaths</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 text-center">
                  <p className="text-xl font-bold text-blue-700">{playerStats.total_assists}</p>
                  <p className="text-xs text-blue-600">Assists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Match History */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Recent Match History</CardTitle>
            </CardHeader>
            <CardContent>
              {recentMatches.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No match history yet</p>
              ) : (
                <div className="space-y-2">
                  {recentMatches.map((match, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-10 rounded-full ${match.is_win ? "bg-green-500" : "bg-red-500"}`} />
                        {match.hero && (
                          <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={`/heroes/${match.hero.id}.png`}
                              alt={match.hero.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">vs {match.opponent_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {match.kills}/{match.deaths}/{match.assists} KDA
                            {match.is_mvp && <span className="ml-2 text-yellow-600">MVP</span>}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-sm ${match.is_win ? "text-green-600" : "text-red-600"}`}>
                          {match.is_win ? "WIN" : "LOSS"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(match.match_date), "MMM d")}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
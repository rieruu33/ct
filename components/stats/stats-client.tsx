"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Trophy, Target, Percent, Swords, Users, Star, DollarSign } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface TeamStats {
  total_matches: number
  wins: number
  losses: number
  winrate: number
  total_tournaments: number
  completed_tournaments: number
  total_prize: number
}

interface HeroStat {
  id: string
  name: string
  role: string
  picks: number
  wins: number
  winrate: number
}

interface PlayerStat {
  id: number
  nickname: string
  matches: number
  wins: number
  mvps: number
  kills: number
  deaths: number
  assists: number
  winrate: number
  kda: string
}

interface StatsClientProps {
  teamStats: TeamStats
  mostPickedHeroes: HeroStat[]
  bestWinrateHeroes: HeroStat[]
  topMvpPlayers: PlayerStat[]
  topWinratePlayers: PlayerStat[]
}

export function StatsClient({
  teamStats,
  mostPickedHeroes,
  bestWinrateHeroes,
  topMvpPlayers,
  topWinratePlayers,
}: StatsClientProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <BarChart3 className="h-8 w-8" />
          Team Statistics
        </h1>
        <p className="text-muted-foreground mt-1">Universal team performance overview</p>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{teamStats.total_matches}</p>
              <p className="text-xs text-muted-foreground">Total Matches</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">W</div>
              <p className="text-2xl font-bold text-green-600">{teamStats.wins}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">L</div>
              <p className="text-2xl font-bold text-red-600">{teamStats.losses}</p>
              <p className="text-xs text-muted-foreground">Losses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 text-center">
              <Percent className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{teamStats.winrate}%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-2xl font-bold">{teamStats.total_tournaments}</p>
              <p className="text-xs text-muted-foreground">Tournaments</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="shadow-sm border-0">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-lg font-bold text-green-600">{formatCurrency(teamStats.total_prize)}</p>
              <p className="text-xs text-muted-foreground">Total Prize</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Picked Heroes */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Swords className="h-5 w-5" />
              Most Picked Heroes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mostPickedHeroes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {mostPickedHeroes.map((hero, index) => (
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image
                        src={`/heroes/${hero.id}.png`}
                        alt={hero.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{hero.name}</p>
                      <p className="text-xs text-muted-foreground">{hero.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{hero.picks} picks</p>
                      <p className="text-xs text-green-600">{hero.winrate}% WR</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Best Winrate Heroes */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Best Winrate Heroes (min. 3 games)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bestWinrateHeroes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {bestWinrateHeroes.map((hero, index) => (
                  <motion.div
                    key={hero.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image
                        src={`/heroes/${hero.id}.png`}
                        alt={hero.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{hero.name}</p>
                      <p className="text-xs text-muted-foreground">{hero.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{hero.winrate}% WR</p>
                      <p className="text-xs text-muted-foreground">{hero.picks} games</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top MVP Players */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top MVP Players
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topMvpPlayers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topMvpPlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {player.nickname.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{player.nickname}</p>
                      <p className="text-xs text-muted-foreground">{player.matches} matches</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-600">{player.mvps} MVPs</p>
                      <p className="text-xs text-muted-foreground">KDA: {player.kda}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Winrate Players */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Top Winrate Players (min. 3 games)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topWinratePlayers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data yet</p>
            ) : (
              <div className="space-y-3">
                {topWinratePlayers.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {player.nickname.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{player.nickname}</p>
                      <p className="text-xs text-muted-foreground">{player.wins}W - {player.matches - player.wins}L</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{player.winrate}% WR</p>
                      <p className="text-xs text-muted-foreground">{player.matches} games</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}

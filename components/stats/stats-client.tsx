"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BarChart3, Trophy, Target, Percent, Swords, Users, Star, DollarSign, Crown, Filter, Ban, Layers } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface TeamStats {
  total_matches: number; wins: number; losses: number; winrate: number;
  total_tournaments: number; completed_tournaments: number;
  total_prize: number; championships: number;
}

interface DraftStat { matches: number; wins: number; winrate: number; }
interface BanHero { id: string; name: string; role: string; count: number; }

interface StatsClientProps {
  startDate: string;
  teamStats: TeamStats;
  draftStats: { firstPick: DraftStat; secondPick: DraftStat };
  banStats: { ourFirstPick: BanHero[]; ourSecondPick: BanHero[]; enemyFirstPick: BanHero[]; enemySecondPick: BanHero[] };
  mostPickedHeroes: any[]; bestWinrateHeroes: any[];
  topMvpPlayers: any[]; topWinratePlayers: any[];
}

export function StatsClient({
  startDate, teamStats, draftStats, banStats, mostPickedHeroes, bestWinrateHeroes, topMvpPlayers, topWinratePlayers,
}: StatsClientProps) {
  const router = useRouter()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
            Team Statistics
          </h1>
          <p className="text-muted-foreground mt-1">Universal team performance overview</p>
        </div>
        
        {/* FITUR BARU: Filter Tanggal Khusus Drafting */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
          <Filter className="h-4 w-4 text-muted-foreground ml-2" />
          <span className="text-sm font-medium whitespace-nowrap">Drafting Filter From:</span>
          <Input 
            type="date" 
            value={startDate}
            onChange={(e) => router.push(`?startDate=${e.target.value}`)}
            className="h-8 text-sm border-0 focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold">{teamStats.total_matches}</p>
              <p className="text-xs text-muted-foreground">Total Matches</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">W</div>
              <p className="text-2xl font-bold text-green-600">{teamStats.wins}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardContent className="p-4 text-center">
              <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">L</div>
              <p className="text-2xl font-bold text-red-600">{teamStats.losses}</p>
              <p className="text-xs text-muted-foreground">Losses</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardContent className="p-4 text-center">
              <Percent className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold">{teamStats.winrate}%</p>
              <p className="text-xs text-muted-foreground">Win Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-slate-600" />
              <p className="text-2xl font-bold">{teamStats.total_tournaments}</p>
              <p className="text-xs text-muted-foreground">Tournaments</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card className="shadow-sm border-0 h-full bg-gradient-to-b from-yellow-50 to-white">
            <CardContent className="p-4 text-center">
              <Crown className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">{teamStats.championships}</p>
              <p className="text-xs text-muted-foreground">Champions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="shadow-sm border-0 h-full">
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <p className="text-lg font-bold text-emerald-600 truncate">{formatCurrency(teamStats.total_prize)}</p>
              <p className="text-xs text-muted-foreground">Total Prize</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Drafting Performance & Ban Analysis */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-12">
        <Layers className="h-6 w-6" /> Drafting Performance
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        
        {/* First Pick vs Second Pick */}
        <Card className="shadow-sm border-0 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Draft Priority Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-2">1st Pick</span>
              <span className="text-4xl font-bold text-blue-700">{draftStats.firstPick.winrate}%</span>
              <span className="text-xs text-muted-foreground mt-2">{draftStats.firstPick.wins}W - {draftStats.firstPick.matches - draftStats.firstPick.wins}L</span>
            </div>
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center">
              <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase mb-2">2nd Pick</span>
              <span className="text-4xl font-bold text-indigo-700">{draftStats.secondPick.winrate}%</span>
              <span className="text-xs text-muted-foreground mt-2">{draftStats.secondPick.wins}W - {draftStats.secondPick.matches - draftStats.secondPick.wins}L</span>
            </div>
          </CardContent>
        </Card>

        {/* Ban Analysis */}
        <Card className="shadow-sm border-0 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" />
              Ban Analysis (Top 5 Heroes)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            
            {/* Our Bans */}
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-xs text-red-600 uppercase mb-1">Our Bans (as 1st Pick)</p>
                <div className="flex gap-1 flex-wrap">
                  {banStats.ourFirstPick.length ? banStats.ourFirstPick.map(b => (
                    <div key={b.id} className="relative w-8 h-8 rounded-md overflow-hidden" title={`${b.name} (${b.count} bans)`}>
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                    </div>
                  )) : <span className="text-xs text-muted-foreground">No data</span>}
                </div>
              </div>
              <div>
                <p className="font-semibold text-xs text-red-600 uppercase mb-1">Our Bans (as 2nd Pick)</p>
                <div className="flex gap-1 flex-wrap">
                  {banStats.ourSecondPick.length ? banStats.ourSecondPick.map(b => (
                    <div key={b.id} className="relative w-8 h-8 rounded-md overflow-hidden" title={`${b.name} (${b.count} bans)`}>
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                    </div>
                  )) : <span className="text-xs text-muted-foreground">No data</span>}
                </div>
              </div>
            </div>

            {/* Enemy Bans */}
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-xs text-blue-600 uppercase mb-1">Enemy Bans (vs Our 1st Pick)</p>
                <div className="flex gap-1 flex-wrap">
                  {banStats.enemyFirstPick.length ? banStats.enemyFirstPick.map(b => (
                    <div key={b.id} className="relative w-8 h-8 rounded-md overflow-hidden" title={`${b.name} (${b.count} bans)`}>
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                    </div>
                  )) : <span className="text-xs text-muted-foreground">No data</span>}
                </div>
              </div>
              <div>
                <p className="font-semibold text-xs text-blue-600 uppercase mb-1">Enemy Bans (vs Our 2nd Pick)</p>
                <div className="flex gap-1 flex-wrap">
                  {banStats.enemySecondPick.length ? banStats.enemySecondPick.map(b => (
                    <div key={b.id} className="relative w-8 h-8 rounded-md overflow-hidden" title={`${b.name} (${b.count} bans)`}>
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                    </div>
                  )) : <span className="text-xs text-muted-foreground">No data</span>}
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Player and Hero Stats */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-8">
        <Users className="h-6 w-6" /> Individual Performance
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
                  <motion.div key={hero.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
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
                  <motion.div key={hero.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                    <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-muted shrink-0">
                      <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
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
                  <motion.div key={player.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
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
                  <motion.div key={player.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
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
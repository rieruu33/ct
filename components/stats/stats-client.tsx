"use client"

import { useState } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  BarChart3, Trophy, Target, Percent, Swords, Users, Star, 
  DollarSign, Crown, Filter, Ban, Layers, ShieldAlert, Zap,
  ChevronLeft, ChevronRight 
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface TeamStats {
  total_matches: number; wins: number; losses: number; winrate: number;
  total_tournaments: number; completed_tournaments: number;
  total_prize: number; championships: number;
}
interface DraftStat { matches: number; wins: number; winrate: number; }
interface BanHero { id: string; name: string; role: string; count: number; }
interface EnemyHero { id: string; name: string; role: string; total: number; enemyWinrate: number; }

interface StatsClientProps {
  startDate: string;
  teamStats: TeamStats;
  draftStats: { firstPick: DraftStat; secondPick: DraftStat };
  banStats: { ourFirstPick: BanHero[]; ourSecondPick: BanHero[]; enemyFirstPick: BanHero[]; enemySecondPick: BanHero[] };
  enemyMostPicked: EnemyHero[];
  enemyKryptonite: EnemyHero[];
  mostPickedHeroes: any[]; 
  bestWinrateHeroes: any[];
  topMvpPlayers: any[]; 
  topWinratePlayers: any[];
}

export function StatsClient({
  startDate, teamStats, draftStats, banStats, enemyMostPicked, enemyKryptonite, 
  mostPickedHeroes, bestWinrateHeroes, topMvpPlayers, topWinratePlayers,
}: StatsClientProps) {
  const router = useRouter()
  const itemsPerPage = 5

  // States for Pagination
  const [pageEnemy, setPageEnemy] = useState(1)
  const [pageMostPicked, setPageMostPicked] = useState(1)
  const [pageBestWinrate, setPageBestWinrate] = useState(1)
  const [pageMvp, setPageMvp] = useState(1)
  const [pagePlayerWinrate, setPagePlayerWinrate] = useState(1)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
  }

  const PaginationControls = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => (
    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-muted/60">
      <button 
        onClick={() => onPageChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="p-1 rounded-md hover:bg-muted disabled:opacity-30 transition-opacity"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Page {current} of {total}</span>
      <button 
        onClick={() => onPageChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="p-1 rounded-md hover:bg-muted disabled:opacity-30 transition-opacity"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )

  const getPaginatedData = (data: any[], page: number) => {
    const start = (page - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Team Statistics
          </h1>
          <p className="text-muted-foreground mt-1">Universal team performance overview</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border shadow-sm">
          <Filter className="h-4 w-4 text-muted-foreground ml-2" />
          <span className="text-sm font-medium whitespace-nowrap">Drafting Filter From:</span>
          <Input 
            type="date" 
            value={startDate}
            onChange={(e) => router.push(`?startDate=${e.target.value}`)}
            className="h-8 text-sm border-0 focus-visible:ring-0 outline-none w-[150px]"
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
        <Card className="shadow-sm border-0 bg-blue-50/50">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Matches</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-bold">{teamStats.total_matches}</h3>
              <span className="text-[10px] text-muted-foreground">Total</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-green-50/50">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider mb-1">Win Rate</p>
            <h3 className="text-2xl font-bold">{teamStats.winrate}%</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-slate-50/50">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">W / L</p>
            <h3 className="text-2xl font-bold">{teamStats.wins}<span className="text-muted-foreground font-normal mx-1">/</span>{teamStats.losses}</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-purple-50/50">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider mb-1">Tournaments</p>
            <h3 className="text-2xl font-bold">{teamStats.total_tournaments}</h3>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-amber-50/50">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-1">Championships</p>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <h3 className="text-2xl font-bold">{teamStats.championships}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-emerald-50/50 lg:col-span-2">
          <CardContent className="p-4">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Total Prize Pool</p>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xl font-bold">{formatCurrency(teamStats.total_prize)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drafting & Bans */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-12 text-slate-800">
        <Layers className="h-6 w-6 text-indigo-500" /> Drafting Performance
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-red-500">
              <Target className="h-5 w-5" /> Side Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <p className="text-xs font-medium text-blue-600 mb-1">First Pick</p>
              <h4 className="text-2xl font-bold">{draftStats.firstPick.winrate}%</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{draftStats.firstPick.wins}W - {draftStats.firstPick.matches - draftStats.firstPick.wins}L</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-purple-50/50 border border-purple-100">
              <p className="text-xs font-medium text-purple-600 mb-1">Second Pick</p>
              <h4 className="text-2xl font-bold">{draftStats.secondPick.winrate}%</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{draftStats.secondPick.wins}W - {draftStats.secondPick.matches - draftStats.secondPick.wins}L</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Ban className="h-5 w-5 text-red-500" /> Ban Analysis (Top 5 Heroes)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm py-4">
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[10px] text-red-600 uppercase tracking-wider mb-2">Our Bans (1st Pick)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.ourFirstPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-muted shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-[10px] text-red-600 uppercase tracking-wider mb-2">Our Bans (2nd Pick)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.ourSecondPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-muted shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[10px] text-blue-600 uppercase tracking-wider mb-2">Enemy Bans (vs 1st)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.enemyFirstPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-muted shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-[10px] text-blue-600 uppercase tracking-wider mb-2">Enemy Bans (vs 2nd)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.enemySecondPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-muted shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enemy Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" /> Enemy Priority Picks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getPaginatedData(enemyMostPicked, pageEnemy).map((hero) => (
                <div key={hero.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{hero.name}</p>
                    <p className="text-xs text-muted-foreground">{hero.total} picks</p>
                  </div>
                  <div className="text-right text-sm font-bold text-red-600">{hero.enemyWinrate}% WR</div>
                </div>
              ))}
              <PaginationControls current={pageEnemy} total={Math.ceil(enemyMostPicked.length / itemsPerPage) || 1} onPageChange={setPageEnemy} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-slate-900 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <ShieldAlert className="h-5 w-5 text-red-400" /> Enemy Threats (Min. 2 Picks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enemyKryptonite.filter(h => h.total >= 2).length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-sm italic">No major threats yet.</p>
              ) : (
                enemyKryptonite.filter(h => h.total >= 2).slice(0, 5).map((hero) => (
                  <div key={hero.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5">
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-slate-100">{hero.name}</p>
                      <p className="text-xs text-slate-400">{hero.total} matches</p>
                    </div>
                    <div className="text-right text-red-400 font-bold">{hero.enemyWinrate}%</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Performance Section */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-8 text-slate-800">
        <Users className="h-6 w-6 text-blue-500" /> Individual Performance (All Time)
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-600">
              <Swords className="h-5 w-5" /> Most Picked Heroes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(mostPickedHeroes, pageMostPicked).map((hero, index) => (
                <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <span className="text-[10px] font-bold text-muted-foreground w-4 text-center">{(pageMostPicked - 1) * 5 + index + 1}</span>
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{hero.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{hero.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{hero.picks} picks</p>
                    <p className="text-xs text-green-600 font-medium">{hero.winrate}% WR</p>
                  </div>
                </div>
              ))}
              <PaginationControls current={pageMostPicked} total={Math.ceil(mostPickedHeroes.length / itemsPerPage) || 1} onPageChange={setPageMostPicked} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-emerald-600">
              <Percent className="h-5 w-5" /> Hero Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(bestWinrateHeroes, pageBestWinrate).map((hero, index) => (
                <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <span className="text-[10px] font-bold text-muted-foreground w-4 text-center">{(pageBestWinrate - 1) * 5 + index + 1}</span>
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{hero.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{hero.picks} games</p>
                  </div>
                  <div className="text-right text-sm font-bold text-blue-600">{hero.winrate}% WR</div>
                </div>
              ))}
              <PaginationControls current={pageBestWinrate} total={Math.ceil(bestWinrateHeroes.length / itemsPerPage) || 1} onPageChange={setPageBestWinrate} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-yellow-600">
              <Star className="h-5 w-5 fill-current" /> Player MVP Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(topMvpPlayers, pageMvp).map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-700 font-bold shrink-0 text-sm">
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{player.nickname}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{player.matches} matches</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-600">{player.mvps} MVPs</p>
                    <p className="text-[10px] text-muted-foreground italic">KDA {player.kda}</p>
                  </div>
                </div>
              ))}
              <PaginationControls current={pageMvp} total={Math.ceil(topMvpPlayers.length / itemsPerPage) || 1} onPageChange={setPageMvp} />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-600">
              <Crown className="h-5 w-5" /> Player Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(topWinratePlayers, pagePlayerWinrate).map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 font-bold shrink-0 text-sm">
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{player.nickname}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{player.wins}W - {player.matches - player.wins}L</p>
                  </div>
                  <div className="text-right text-sm font-bold text-green-600">{player.winrate}% WR</div>
                </div>
              ))}
              <PaginationControls current={pagePlayerWinrate} total={Math.ceil(topWinratePlayers.length / itemsPerPage) || 1} onPageChange={setPagePlayerWinrate} />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
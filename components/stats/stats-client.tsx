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
import { cn } from "@/lib/utils"

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

  // Fungsi pembantu pagination
  const getPaginatedData = (data: any[], page: number) => {
    const start = (page - 1) * itemsPerPage
    return data.slice(start, start + itemsPerPage)
  }

  // Komponen kontrol pagination manual
  const PaginationControls = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => (
    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-border">
      <button 
        onClick={() => onPageChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="p-1 rounded-md hover:bg-muted disabled:opacity-30 transition-opacity"
      >
        <ChevronLeft className="h-4 w-4 text-foreground" />
      </button>
      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Page {current} of {total}</span>
      <button 
        onClick={() => onPageChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="p-1 rounded-md hover:bg-muted disabled:opacity-30 transition-opacity"
      >
        <ChevronRight className="h-4 w-4 text-foreground" />
      </button>
    </div>
  )

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
            <BarChart3 className="h-8 w-8 text-primary" />
            Team Statistics
          </h1>
          <p className="text-muted-foreground mt-1">Universal team performance overview</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border shadow-sm">
          <Filter className="h-4 w-4 text-muted-foreground ml-2" />
          <span className="text-sm font-medium whitespace-nowrap text-foreground">Drafting Filter:</span>
          <Input 
            type="date" 
            value={startDate}
            onChange={(e) => router.push(`?startDate=${e.target.value}`)}
            className="h-8 text-sm border-0 focus-visible:ring-0 outline-none w-[150px] bg-transparent text-foreground"
          />
        </div>
      </div>

      {/* OVERVIEW CARDS SECTION - FIXED GRID TO PREVENT WRAPPING */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-foreground">{teamStats.total_matches}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Matches</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-bold">W</div>
            <p className="text-2xl font-bold text-green-600">{teamStats.wins}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Wins</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">L</div>
            <p className="text-2xl font-bold text-red-600">{teamStats.losses}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Losses</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 text-center">
            <Percent className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-foreground">{teamStats.winrate}%</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Win Rate</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-slate-500" />
            <p className="text-2xl font-bold text-foreground">{teamStats.total_tournaments}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Tournaments</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-card border-amber-200/50 dark:border-amber-900/50">
          <CardContent className="p-4 text-center">
            <Crown className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold text-amber-600">{teamStats.championships}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Champions</p>
          </CardContent>
        </Card>

        {/* Removed lg:col-span-2 so it fits perfectly as the 7th card on xl screens */}
        <Card className="shadow-sm border-border bg-card">
          <CardContent className="p-4 text-center">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-lg font-bold text-emerald-600 truncate">{formatCurrency(teamStats.total_prize)}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Prize Pool</p>
          </CardContent>
        </Card>
      </div>

      {/* DRAFTING PERFORMANCE SECTION */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-12 text-foreground">
        <Layers className="h-6 w-6 text-primary" /> Drafting Performance
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Win Rate Side */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Target className="h-5 w-5 text-red-500" /> Side Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center p-4 rounded-2xl bg-muted/50 border border-border">
              <p className="text-xs font-medium text-blue-600 mb-1">FIRST PICK</p>
              <h4 className="text-2xl font-bold text-foreground">{draftStats.firstPick.winrate}%</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{draftStats.firstPick.wins}W - {draftStats.firstPick.matches - draftStats.firstPick.wins}L</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-muted/50 border border-border">
              <p className="text-xs font-medium text-purple-600 mb-1">SECOND PICK</p>
              <h4 className="text-2xl font-bold text-foreground">{draftStats.secondPick.winrate}%</h4>
              <p className="text-[10px] text-muted-foreground mt-1">{draftStats.secondPick.wins}W - {draftStats.secondPick.matches - draftStats.secondPick.wins}L</p>
            </div>
          </CardContent>
        </Card>

        {/* Ban Analysis 4 Column */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Ban className="h-5 w-5 text-red-500" /> Ban Analysis (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm py-4">
            {/* Kolom Kiri: Our Bans */}
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[9px] text-red-600 uppercase tracking-wider mb-2">Our Bans (1st Pick)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.ourFirstPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-border shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-[9px] text-red-600 uppercase tracking-wider mb-2">Our Bans (2nd Pick)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.ourSecondPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-border shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Kolom Kanan: Enemy Bans */}
            <div className="space-y-4">
              <div>
                <p className="font-bold text-[9px] text-blue-600 uppercase tracking-wider mb-2">Enemy Bans (vs 1st)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.enemyFirstPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-border shadow-sm">
                      <Image src={`/heroes/${b.id}.png`} alt={b.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 font-bold">{b.count}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-bold text-[9px] text-blue-600 uppercase tracking-wider mb-2">Enemy Bans (vs 2nd)</p>
                <div className="flex gap-1.5 flex-wrap">
                  {banStats.enemySecondPick.map(b => (
                    <div key={b.id} className="relative w-9 h-9 rounded-lg overflow-hidden border border-border shadow-sm">
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

      {/* ENEMY ANALYSIS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Enemy Priority Picks */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Zap className="h-5 w-5 text-yellow-500" /> Enemy Priority Picks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getPaginatedData(enemyMostPicked, pageEnemy).map((hero) => (
                <div key={hero.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 border border-border">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{hero.name}</p>
                    <p className="text-xs text-muted-foreground">{hero.total} times picked</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", hero.enemyWinrate >= 60 ? 'text-red-600' : 'text-green-600')}>
                      {hero.enemyWinrate}% WR
                    </p>
                  </div>
                </div>
              ))}
              <PaginationControls 
                current={pageEnemy} 
                total={Math.ceil(enemyMostPicked.length / itemsPerPage) || 1} 
                onPageChange={setPageEnemy} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Our Kryptonite */}
        <Card className="shadow-sm border-border bg-slate-950 text-slate-50 dark:bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" /> Enemy Threats (Min. 2 Picks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enemyKryptonite.filter(h => h.total >= 2).length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-sm italic">No major threat data recorded.</p>
              ) : (
                enemyKryptonite.filter(h => h.total >= 2).slice(0, 5).map((hero) => (
                  <div key={hero.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 border border-white/10">
                      <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate text-slate-100">{hero.name}</p>
                      <p className="text-xs text-slate-400">{hero.total} matches played</p>
                    </div>
                    <div className="text-right text-red-400 font-bold">{hero.enemyWinrate}%</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* INDIVIDUAL PERFORMANCE SECTION */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-8 text-foreground">
        <Users className="h-6 w-6 text-blue-500" /> Individual Performance (All Time)
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Most Picked Heroes */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Swords className="h-5 w-5 text-blue-600" /> Most Picked Heroes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(mostPickedHeroes, pageMostPicked).map((hero, index) => (
                <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground w-4 text-center">{(pageMostPicked - 1) * 5 + index + 1}</span>
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-muted border border-border">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{hero.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{hero.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{hero.picks} picks</p>
                    <p className="text-xs text-green-600 font-medium">{hero.winrate}% WR</p>
                  </div>
                </div>
              ))}
              <PaginationControls current={pageMostPicked} total={Math.ceil(mostPickedHeroes.length / itemsPerPage) || 1} onPageChange={setPageMostPicked} />
            </div>
          </CardContent>
        </Card>

        {/* Hero Win Rates */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Percent className="h-5 w-5 text-emerald-600" /> Hero Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(bestWinrateHeroes, pageBestWinrate).map((hero, index) => (
                <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground w-4 text-center">{(pageBestWinrate - 1) * 5 + index + 1}</span>
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-muted border border-border">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{hero.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{hero.picks} games</p>
                  </div>
                  <div className="text-right text-sm font-bold text-blue-600">{hero.winrate}% WR</div>
                </div>
              ))}
              <PaginationControls current={pageBestWinrate} total={Math.ceil(bestWinrateHeroes.length / itemsPerPage) || 1} onPageChange={setPageBestWinrate} />
            </div>
          </CardContent>
        </Card>

        {/* Player MVP Standings */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" /> Player MVP Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(topMvpPlayers, pageMvp).map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-700 font-bold shrink-0 text-sm border border-yellow-200/50">
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{player.nickname}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">{player.matches} matches</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-yellow-600">{player.mvps} MVPs</p>
                    <p className="text-[10px] text-muted-foreground italic tracking-tighter">KDA {player.kda}</p>
                  </div>
                </div>
              ))}
              <PaginationControls current={pageMvp} total={Math.ceil(topMvpPlayers.length / itemsPerPage) || 1} onPageChange={setPageMvp} />
            </div>
          </CardContent>
        </Card>

        {/* Player Win Rates */}
        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
              <Crown className="h-5 w-5 text-green-600" /> Player Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(topWinratePlayers, pagePlayerWinrate).map((player, index) => (
                <div key={player.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 font-bold shrink-0 text-sm border border-green-200/50">
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">{player.nickname}</p>
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
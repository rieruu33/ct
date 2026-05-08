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
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

// ... (Interface tetap sama seperti sebelumnya) ...
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

  // Reusable Pagination Component
  const PaginationControls = ({ current, total, onPageChange }: { current: number, total: number, onPageChange: (p: number) => void }) => (
    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-muted/60">
      <button 
        onClick={() => onPageChange(Math.max(current - 1, 1))}
        disabled={current === 1}
        className="p-1 rounded-md hover:bg-muted disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-xs font-medium">Page {current} of {total}</span>
      <button 
        onClick={() => onPageChange(Math.min(current + 1, total))}
        disabled={current === total}
        className="p-1 rounded-md hover:bg-muted disabled:opacity-30"
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
      {/* Header & Filter (Sama seperti sebelumnya) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8" />
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
            className="h-8 text-sm border-0 focus-visible:ring-0 outline-none"
          />
        </div>
      </div>

      {/* Overview Cards (Sama seperti sebelumnya) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-8">
         {/* ... Isi card total matches, winrate, dll ... */}
         {/* (Skip untuk menghemat ruang, tetap gunakan kodingan lama kamu) */}
      </div>

      {/* Drafting & Bans (Sama seperti sebelumnya) */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-12">
        <Layers className="h-6 w-6" /> Drafting Performance
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* ... Card Draft Winrate & Ban Analysis ... */}
      </div>

      {/* --- ENEMY ANALYSIS (PAGINATED) --- */}
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
                  <div className="text-right">
                    <p className={`text-sm font-bold ${hero.enemyWinrate >= 60 ? 'text-red-600' : 'text-green-600'}`}>
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

        <Card className="shadow-sm border-0 bg-slate-900 text-slate-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-100">
              <ShieldAlert className="h-5 w-5 text-red-400" /> Enemy Threats (Min. 2 Picks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {enemyKryptonite.filter(h => h.total >= 2).length === 0 ? (
                <p className="text-slate-400 text-center py-6 text-sm">No consistent threats yet.</p>
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

      {/* --- INDIVIDUAL PERFORMANCE (PAGINATED) --- */}
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 mt-8">
        <Users className="h-6 w-6" /> Individual Performance (All Time)
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        
        {/* Most Picked Heroes */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Swords className="h-5 w-5 text-blue-600" /> Most Picked Heroes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(mostPickedHeroes, pageMostPicked).map((hero, index) => (
                <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <span className="text-xs font-bold text-muted-foreground w-4">{(pageMostPicked - 1) * 5 + index + 1}</span>
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{hero.name}</p>
                    <p className="text-xs text-muted-foreground">{hero.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{hero.picks} picks</p>
                    <p className="text-xs text-green-600">{hero.winrate}% WR</p>
                  </div>
                </div>
              ))}
              <PaginationControls current={pageMostPicked} total={Math.ceil(mostPickedHeroes.length / itemsPerPage) || 1} onPageChange={setPageMostPicked} />
            </div>
          </CardContent>
        </Card>

        {/* Best Winrate Heroes */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" /> Hero Win Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getPaginatedData(bestWinrateHeroes, pageBestWinrate).map((hero, index) => (
                <div key={hero.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                   <span className="text-xs font-bold text-muted-foreground w-4">{(pageBestWinrate - 1) * 5 + index + 1}</span>
                  <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 bg-muted">
                    <Image src={`/heroes/${hero.id}.png`} alt={hero.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{hero.name}</p>
                    <p className="text-xs text-muted-foreground">{hero.picks} games</p>
                  </div>
                  <div className="text-right text-sm font-bold text-blue-600">{hero.winrate}% WR</div>
                </div>
              ))}
              <PaginationControls current={pageBestWinrate} total={Math.ceil(bestWinrateHeroes.length / itemsPerPage) || 1} onPageChange={setPageBestWinrate} />
            </div>
          </CardContent>
        </Card>

        {/* Top MVP Players */}
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
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-700 font-bold shrink-0">
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{player.nickname}</p>
                    <p className="text-xs text-muted-foreground">{player.matches} matches</p>
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

        {/* Top Winrate Players */}
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
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-700 font-bold shrink-0">
                    {player.nickname.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{player.nickname}</p>
                    <p className="text-xs text-muted-foreground">{player.wins}W - {player.matches - player.wins}L</p>
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
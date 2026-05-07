"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Match } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, ChevronLeft, ChevronRight, ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { motion } from "framer-motion"

interface MatchWithDetails extends Match {
  player_stats: any[]
  bans: any[]
}

interface HistoryClientProps {
  matches: MatchWithDetails[]
  currentPage: number
  totalPages: number
}

export function HistoryClient({ matches, currentPage, totalPages }: HistoryClientProps) {
  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <History className="h-8 w-8" />
          Match History
        </h1>
        <p className="text-muted-foreground mt-1">All recorded matches</p>
      </div>

      {matches.length === 0 ? (
        <Card className="shadow-sm border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No matches recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {matches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="shadow-sm border-0 overflow-hidden">
                <div className={`h-1 ${match.is_win ? "bg-green-500" : "bg-red-500"}`} />
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Match Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-lg ${match.is_win ? "bg-green-500" : "bg-red-500"}`}>
                        {match.is_win ? "W" : "L"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">vs {match.opponent_name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {match.tournament?.name || "Friendly Match"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(match.match_date), "EEEE, MMMM d, yyyy 'at' HH:mm")}
                        </p>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{match.our_score} - {match.opponent_score}</p>
                        <p className="text-xs text-muted-foreground">Final Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Player Stats */}
                  {match.player_stats.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <p className="text-sm font-medium mb-3">Player Performance</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {match.player_stats.map((stat: any) => (
                          <div
                            key={stat.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
                          >
                            {stat.hero && (
                              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-muted shrink-0">
                                <Image
                                  src={`/heroes/${stat.hero.id}.png`}
                                  alt={stat.hero.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <p className="font-medium text-sm truncate">
                                  {stat.player?.nickname || "Unknown"}
                                </p>
                                {stat.is_mvp && <Star className="h-3 w-3 text-yellow-500 shrink-0" />}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {stat.kills}/{stat.deaths}/{stat.assists}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bans */}
                  {match.bans.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Bans</p>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Our Bans</p>
                          <div className="flex gap-1">
                            {match.bans.filter((b: any) => b.is_our_ban).map((ban: any) => (
                              <div key={ban.id} className="w-8 h-8 relative rounded-lg overflow-hidden bg-muted">
                                {ban.hero && (
                                  <Image
                                    src={`/heroes/${ban.hero.id}.png`}
                                    alt={ban.hero.name}
                                    fill
                                    className="object-cover grayscale"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Enemy Bans</p>
                          <div className="flex gap-1">
                            {match.bans.filter((b: any) => !b.is_our_ban).map((ban: any) => (
                              <div key={ban.id} className="w-8 h-8 relative rounded-lg overflow-hidden bg-muted">
                                {ban.hero && (
                                  <Image
                                    src={`/heroes/${ban.hero.id}.png`}
                                    alt={ban.hero.name}
                                    fill
                                    className="object-cover grayscale"
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Screenshot Link */}
                  {match.screenshot_url && (
                    <div className="mt-4">
                      <a
                        href={match.screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        View Screenshot <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Link
            href={`/history?page=${currentPage - 1}`}
            className={`p-2 rounded-lg hover:bg-muted transition-colors ${
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link
                key={page}
                href={`/history?page=${page}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  page === currentPage
                    ? "bg-foreground text-background"
                    : "hover:bg-muted"
                }`}
              >
                {page}
              </Link>
            ))}
          </div>
          
          <Link
            href={`/history?page=${currentPage + 1}`}
            className={`p-2 rounded-lg hover:bg-muted transition-colors ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      )}
    </PageWrapper>
  )
}

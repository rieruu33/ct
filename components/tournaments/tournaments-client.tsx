"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Tournament } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, ExternalLink, Calendar, DollarSign, Medal } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"

interface TournamentWithStats extends Tournament {
  total_matches: number
  wins: number
}

interface TournamentsClientProps {
  tournaments: TournamentWithStats[]
}

const statusColors: Record<string, string> = {
  "upcoming": "bg-blue-500/10 text-blue-700",
  "ongoing": "bg-green-500/10 text-green-700",
  "completed": "bg-gray-500/10 text-gray-700",
}

const placementColors: Record<string, string> = {
  "Champion": "bg-yellow-500 text-yellow-900",
  "Runner-up": "bg-gray-300 text-gray-800",
  "Top 4": "bg-orange-400 text-orange-900",
  "Top 8": "bg-blue-400 text-blue-900",
  "Top 16": "bg-purple-400 text-purple-900",
}

export function TournamentsClient({ tournaments }: TournamentsClientProps) {
  // Group by status
  const ongoing = tournaments.filter(t => t.status === "ongoing")
  const upcoming = tournaments.filter(t => t.status === "upcoming")
  const completed = tournaments.filter(t => t.status === "completed")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const TournamentCard = ({ tournament, index }: { tournament: TournamentWithStats; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="shadow-sm border-0 overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                  <Trophy className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{tournament.name}</h3>
                  <p className="text-muted-foreground text-sm">{tournament.organizer}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Badge className={statusColors[tournament.status] || "bg-gray-500/10"}>
                  {tournament.status}
                </Badge>
                {tournament.placement && (
                  <Badge className={placementColors[tournament.placement] || "bg-gray-400"}>
                    <Medal className="h-3 w-3 mr-1" />
                    {tournament.placement}
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(tournament.start_date), "MMM d, yyyy")}
                  {tournament.end_date && ` - ${format(new Date(tournament.end_date), "MMM d, yyyy")}`}
                </div>
                {tournament.bracket_url && (
                  <a
                    href={tournament.bracket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Bracket
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-row lg:flex-col gap-4 lg:text-right">
              {tournament.total_matches > 0 && (
                <div>
                  <p className="text-2xl font-bold">
                    {tournament.wins}W - {tournament.total_matches - tournament.wins}L
                  </p>
                  <p className="text-xs text-muted-foreground">Match Record</p>
                </div>
              )}
              
              <div className="flex flex-col gap-1">
                {tournament.registration_fee > 0 && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">-{formatCurrency(tournament.registration_fee)}</span>
                  </div>
                )}
                {tournament.prize_won > 0 && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">+{formatCurrency(tournament.prize_won)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Trophy className="h-8 w-8" />
          Tournaments
        </h1>
        <p className="text-muted-foreground mt-1">Tournament history and achievements</p>
      </div>

      {tournaments.length === 0 ? (
        <Card className="shadow-sm border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No tournaments recorded yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Ongoing */}
          {ongoing.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Ongoing Tournaments
              </h2>
              <div className="space-y-4">
                {ongoing.map((t, i) => <TournamentCard key={t.id} tournament={t} index={i} />)}
              </div>
            </div>
          )}

          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Upcoming Tournaments
              </h2>
              <div className="space-y-4">
                {upcoming.map((t, i) => <TournamentCard key={t.id} tournament={t} index={i} />)}
              </div>
            </div>
          )}

          {/* Completed */}
          {completed.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Completed Tournaments ({completed.length})
              </h2>
              <div className="space-y-4">
                {completed.map((t, i) => <TournamentCard key={t.id} tournament={t} index={i} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  )
}

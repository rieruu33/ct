"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Tournament, Match } from "@/lib/types"
import { Calendar, Trophy, History, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import Link from "next/link"

interface HomeClientProps {
  upcomingTournaments: Tournament[]
  recentMatches: Match[]
  allTournaments: Tournament[]
}

export function HomeClient({ upcomingTournaments, recentMatches, allTournaments }: HomeClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get tournament dates for calendar highlighting
  const tournamentDates = allTournaments.flatMap(t => {
    const dates: Date[] = []
    const start = new Date(t.start_date)
    const end = t.end_date ? new Date(t.end_date) : start
    let current = new Date(start)
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    return dates
  })

  const hasTournament = (date: Date) => {
    return tournamentDates.some(td => isSameDay(td, date))
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cukup Tau</h1>
        <p className="text-muted-foreground mt-1">Dashboard overview for your CTCT</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <Card className="lg:col-span-2 shadow-sm border-0 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Calendar className="h-5 w-5" />
              Tournament Calendar
            </CardTitle>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="h-10" />
              ))}
              {days.map(day => {
                const hasEvent = hasTournament(day)
                const isToday = isSameDay(day, new Date())
                
                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      h-10 flex items-center justify-center rounded-lg text-sm relative
                      ${!isSameMonth(day, currentMonth) ? "text-muted-foreground/50" : ""}
                      ${isToday ? "bg-foreground text-background font-semibold" : ""}
                      ${hasEvent && !isToday ? "bg-primary/10 font-medium" : ""}
                    `}
                  >
                    {format(day, "d")}
                    {hasEvent && !isToday && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-foreground" />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-sm border-0 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <Trophy className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTournaments.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingTournaments.map(tournament => (
                  <div
                    key={tournament.id}
                    className="p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{tournament.name}</h3>
                        <p className="text-xs text-muted-foreground">{tournament.organizer}</p>
                      </div>
                      <Badge variant={tournament.status === "ongoing" ? "default" : "secondary"} className="text-xs shrink-0">
                        {tournament.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(tournament.start_date), "MMM d, yyyy")}
                      </span>
                      {tournament.bracket_url && (
                        <a
                          href={tournament.bracket_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          Bracket <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card className="lg:col-span-3 shadow-sm border-0 bg-card">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <History className="h-5 w-5" />
              Recent Matches
            </CardTitle>
            <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            {recentMatches.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4 text-center">No matches recorded yet</p>
            ) : (
              <div className="space-y-2">
                {recentMatches.map(match => (
                  <div
                    key={match.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-10 rounded-full ${match.is_win ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <p className="font-medium">vs {match.opponent_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {match.tournament?.name || "Friendly Match"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${match.is_win ? "text-green-600" : "text-red-600"}`}>
                        {match.our_score} - {match.opponent_score}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(match.match_date), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}

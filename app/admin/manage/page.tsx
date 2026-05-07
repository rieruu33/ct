"use client"

import { useEffect, useState } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
// TAMBAHAN: Import icon Edit dan CircleDollarSign untuk tab Finance
import { ArrowLeft, Trash2, Trophy, Swords, Users, Loader2, AlertTriangle, Edit, CircleDollarSign } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface Tournament {
  id: number
  name: string
  organizer: string
  start_date: string
  status: string
}

interface Match {
  id: number
  opponent_name: string
  match_date: string
  is_win: boolean
  our_score: number
  opponent_score: number
  tournaments?: { name: string } | null
}

interface Player {
  id: number
  full_name: string
  nickname: string
  role: string
}

// TAMBAHAN: Interface untuk Finance
interface Finance {
  id: number
  tournament_id: number | null
  type: string
  amount: number
  description: string
  transaction_date: string
  tournaments?: { name: string } | null
}

// TAMBAHAN: Tambahkan "finances" ke dalam tipe Tab
type Tab = "tournaments" | "matches" | "players" | "finances"

export default function ManagePage() {
  const [activeTab, setActiveTab] = useState<Tab>("tournaments")
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [finances, setFinances] = useState<Finance[]>([]) // State untuk finances
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ type: Tab; id: number; name: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // TAMBAHAN: Fetch data finances
    const [tournamentsRes, matchesRes, playersRes, financesRes] = await Promise.all([
      supabase.from("tournaments").select("*").order("start_date", { ascending: false }),
      supabase.from("matches").select("*, tournaments(name)").order("match_date", { ascending: false }),
      supabase.from("players").select("*").order("nickname", { ascending: true }),
      supabase.from("finances").select("*, tournaments(name)").order("transaction_date", { ascending: false }),
    ])

    setTournaments(tournamentsRes.data || [])
    setMatches(matchesRes.data || [])
    setPlayers(playersRes.data || [])
    setFinances(financesRes.data || [])
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return

    setDeleting(confirmDelete.id)

    try {
      // Tentukan tabel berdasarkan tipe
      const table = confirmDelete.type === "tournaments" ? "tournaments" : 
                    confirmDelete.type === "matches" ? "matches" : 
                    confirmDelete.type === "players" ? "players" : "finances"
      
      const { error } = await supabase.from(table).delete().eq("id", confirmDelete.id)

      if (error) throw error

      // Update local state
      if (confirmDelete.type === "tournaments") {
        setTournaments(prev => prev.filter(t => t.id !== confirmDelete.id))
      } else if (confirmDelete.type === "matches") {
        setMatches(prev => prev.filter(m => m.id !== confirmDelete.id))
      } else if (confirmDelete.type === "players") {
        setPlayers(prev => prev.filter(p => p.id !== confirmDelete.id))
      } else {
        setFinances(prev => prev.filter(f => f.id !== confirmDelete.id))
      }

      setConfirmDelete(null)
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeleting(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
  }

  const tabs = [
    { id: "tournaments" as Tab, label: "Tournaments", icon: Trophy, count: tournaments.length },
    { id: "matches" as Tab, label: "Matches", icon: Swords, count: matches.length },
    { id: "players" as Tab, label: "Players", icon: Users, count: players.length },
    { id: "finances" as Tab, label: "Finances", icon: CircleDollarSign, count: finances.length }, // Tab baru
  ]

  return (
    <PageWrapper className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/admin" 
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Manage Data</h1>
        <p className="text-muted-foreground mt-1">Delete & Edit tournaments, matches, players, and finances</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? "bg-background/20" : "bg-foreground/10"
              }`}>
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <Card className="shadow-sm border-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="divide-y">
              {/* TOURNAMENTS */}
              {activeTab === "tournaments" && (
                tournaments.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">No tournaments found</div>
                ) : (
                  tournaments.map(tournament => (
                    <div key={tournament.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{tournament.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tournament.organizer} - {format(new Date(tournament.start_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          tournament.status === "completed" ? "bg-gray-500/10 text-gray-700" :
                          tournament.status === "ongoing" ? "bg-green-500/10 text-green-700" :
                          "bg-blue-500/10 text-blue-700"
                        }`}>
                          {tournament.status}
                        </span>
                        
                        <Link href={`/admin/tournament/edit/${tournament.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setConfirmDelete({ type: "tournaments", id: tournament.id, name: tournament.name })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* MATCHES */}
              {activeTab === "matches" && (
                matches.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">No matches found</div>
                ) : (
                  matches.map(match => (
                    <div key={match.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${match.is_win ? "bg-green-500" : "bg-red-500"}`} />
                          vs {match.opponent_name}
                          <span className="text-muted-foreground">
                            ({match.our_score} - {match.opponent_score})
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {match.tournaments?.name || "No tournament"} - {format(new Date(match.match_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/match/edit/${match.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setConfirmDelete({ type: "matches", id: match.id, name: `vs ${match.opponent_name}` })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* PLAYERS */}
              {activeTab === "players" && (
                players.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">No players found</div>
                ) : (
                  players.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{player.nickname}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.full_name} - {player.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/player/edit/${player.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setConfirmDelete({ type: "players", id: player.id, name: player.nickname })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )
              )}

              {/* FINANCES (TAB BARU) */}
              {activeTab === "finances" && (
                finances.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">No finance records found</div>
                ) : (
                  finances.map(finance => (
                    <div key={finance.id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${finance.type === "income" ? "bg-green-500" : "bg-red-500"}`} />
                          {finance.description || "No description"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(finance.amount)} • {format(new Date(finance.transaction_date), "MMM d, yyyy")}
                          {finance.tournaments?.name && ` • ${finance.tournaments.name}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Tombol Edit Keuangan */}
                        <Link href={`/admin/finance/edit/${finance.id}`}>
                          <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setConfirmDelete({ type: "finances", id: finance.id, name: finance.description || "this transaction" })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Confirm Delete</h3>
                  <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                </div>
              </div>

              <p className="mb-6 text-sm">
                Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
                {confirmDelete.type === "tournaments" && (
                  <span className="block mt-2 text-muted-foreground">
                    This will also delete all matches and finance records associated with this tournament.
                  </span>
                )}
                {confirmDelete.type === "players" && (
                  <span className="block mt-2 text-muted-foreground">
                    This will also delete all match stats for this player.
                  </span>
                )}
              </p>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirmDelete(null)}
                  disabled={deleting !== null}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDelete}
                  disabled={deleting !== null}
                >
                  {deleting !== null ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}
"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Player, Hero, Tournament } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Trophy, Users, Swords, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AdminClientProps {
  players: Player[]
  heroes: Hero[]
  tournaments: Tournament[]
}

const adminCards = [
  {
    title: "Add Tournament",
    description: "Register a new tournament with details and fee",
    href: "/admin/tournament",
    icon: Trophy,
    color: "bg-yellow-500/10 text-yellow-700",
  },
  {
    title: "Add Match",
    description: "Record a new match result with player stats",
    href: "/admin/match",
    icon: Swords,
    color: "bg-red-500/10 text-red-700",
  },
  {
    title: "Add Player",
    description: "Add a new player to the roster",
    href: "/admin/player",
    icon: Users,
    color: "bg-blue-500/10 text-blue-700",
  },
  {
    title: "Add Hero",
    description: "Add a new hero to the database",
    href: "/admin/hero",
    icon: Swords,
    color: "bg-purple-500/10 text-purple-700",
  },
    {
    title: "Manage Data",
    description: "Delete tournaments, matches, and players",
    href: "/admin/manage",
    icon: Trash2,
    color: "bg-gray-500/10 text-gray-700",
  },
]

export function AdminClient({ players, heroes, tournaments }: AdminClientProps) {
  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Settings className="h-8 w-8" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground mt-1">Manage team data and records</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{players.length}</p>
            <p className="text-sm text-muted-foreground">Players</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{heroes.length}</p>
            <p className="text-sm text-muted-foreground">Heroes</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-0">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold">{tournaments.length}</p>
            <p className="text-sm text-muted-foreground">Tournaments</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {adminCards.map((card, index) => {
          const Icon = card.icon
          return (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <Card className="shadow-sm border-0 hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{card.title}</h3>
                    <p className="text-sm text-muted-foreground">{card.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Tournaments */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Recent Tournaments</CardTitle>
        </CardHeader>
        <CardContent>
          {tournaments.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No tournaments yet</p>
          ) : (
            <div className="space-y-2">
              {tournaments.slice(0, 5).map((tournament) => (
                <div
                  key={tournament.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{tournament.name}</p>
                    <p className="text-sm text-muted-foreground">{tournament.organizer}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    tournament.status === "completed" ? "bg-gray-500/10 text-gray-700" :
                    tournament.status === "ongoing" ? "bg-green-500/10 text-green-700" :
                    "bg-blue-500/10 text-blue-700"
                  }`}>
                    {tournament.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}

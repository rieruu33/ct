"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Player } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface RosterClientProps {
  players: Player[]
}

// Warna teks diubah jadi lebih terang agar cocok dengan background hitam transparan
const roleColors: Record<string, string> = {
  "Gold Laner": "text-yellow-400",
  "EXP Laner": "text-purple-400",
  "Mid Laner": "text-blue-400",
  "Roamer": "text-green-400",
  "Jungler": "text-red-400",
}

export function RosterClient({ players }: RosterClientProps) {
  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Users className="h-8 w-8" />
          Team Roster
        </h1>
        <p className="text-muted-foreground mt-1">Meet the players</p>
      </div>

      {players.length === 0 ? (
        <Card className="shadow-sm border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No players added yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/roster/${player.id}`}>
                <Card className="shadow-sm border-0 overflow-hidden group hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="aspect-[3/4] relative bg-muted overflow-hidden">
                    {player.photo_filename ? (
<Image
  src={`/players/${player.photo_filename}`}
  alt={player.nickname}
  fill
  priority={index < 4} 
  // UBAH 'object-top' MENJADI 'object-[center_20%]'
  className="object-cover object-[center_20%] group-hover:scale-105 transition-transform duration-500"
/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                        <span className="text-6xl font-bold text-muted-foreground/30">
                          {player.nickname.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-xl">{player.nickname}</h3>
                      
                      {/* Bagian Span ini yang diubah agar punya background hitam blur */}
                      <span className={`inline-block mt-1 px-2 py-1 rounded-md text-xs font-medium bg-black/60 backdrop-blur-sm ${roleColors[player.role] || "text-white"}`}>
                        {player.role}
                      </span>

                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
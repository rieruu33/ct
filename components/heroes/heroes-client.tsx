"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Hero } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Swords, Filter } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"

interface HeroesClientProps {
  heroes: Hero[]
}

const roleColors: Record<string, string> = {
  "Marksman": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  "Fighter": "bg-orange-500/10 text-orange-700 border-orange-200",
  "Assassin": "bg-red-500/10 text-red-700 border-red-200",
  "Mage": "bg-blue-500/10 text-blue-700 border-blue-200",
  "Tank": "bg-gray-500/10 text-gray-700 border-gray-200",
  "Support": "bg-green-500/10 text-green-700 border-green-200",
}

const roles = ["All", "Marksman", "Fighter", "Assassin", "Mage", "Tank", "Support"]

export function HeroesClient({ heroes }: HeroesClientProps) {
  const [selectedRole, setSelectedRole] = useState("All")

  const filteredHeroes = selectedRole === "All" 
    ? heroes 
    : heroes.filter(h => h.role === selectedRole)

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Swords className="h-8 w-8" />
          Heroes
        </h1>
        <p className="text-muted-foreground mt-1">Mobile Legends: Bang Bang Hero Pool</p>
      </div>

      {/* Role Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {roles.map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${
              selectedRole === role
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {filteredHeroes.length === 0 ? (
        <Card className="shadow-sm border-0">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No heroes found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredHeroes.map((hero, index) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
            >
              <Card className="shadow-sm border-0 overflow-hidden group hover:shadow-md transition-all duration-300">
                
                {/* BAGIAN INI YANG DIUBAH: aspect-square jadi aspect-[3/4] */}
                <div className="aspect-[3/4] relative bg-muted">
                  <Image
                    src={`/heroes/${hero.id}.png`}
                    alt={hero.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Gradasi dihapus supaya tidak bertabrakan dengan card content di bawah */}
                </div>

                <CardContent className="p-3 text-center">
                  <h3 className="font-semibold text-sm truncate">{hero.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 text-xs ${roleColors[hero.role] || "bg-gray-500/10"}`}
                  >
                    {hero.role}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
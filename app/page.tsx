import { createClient } from "@/lib/supabase/server"
import { HomeClient } from "@/components/home/home-client"

export const revalidate = 0

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch upcoming tournaments
  const { data: upcomingTournaments } = await supabase
    .from("tournaments")
    .select("*")
    .in("status", ["upcoming", "ongoing"])
    .order("start_date", { ascending: true })
    .limit(5)

  // Fetch recent matches with tournament info
  const { data: recentMatches } = await supabase
    .from("matches")
    .select(`
      *,
      tournament:tournaments(*)
    `)
    .order("match_date", { ascending: false })
    .limit(5)

  // Fetch all tournaments for calendar
  const { data: allTournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: true })

  return (
    <HomeClient
      upcomingTournaments={upcomingTournaments || []}
      recentMatches={recentMatches || []}
      allTournaments={allTournaments || []}
    />
  )
}

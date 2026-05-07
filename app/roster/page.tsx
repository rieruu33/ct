import { createClient } from "@/lib/supabase/server"
import { RosterClient } from "@/components/roster/roster-client"

export const revalidate = 0

export default async function RosterPage() {
  const supabase = await createClient()

  const { data: players } = await supabase
    .from("players")
    .select("*")
    .order("role", { ascending: true })

  return <RosterClient players={players || []} />
}

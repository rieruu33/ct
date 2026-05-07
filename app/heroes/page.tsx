import { createClient } from "@/lib/supabase/server"
import { HeroesClient } from "@/components/heroes/heroes-client"

export const revalidate = 0

export default async function HeroesPage() {
  const supabase = await createClient()

  const { data: heroes } = await supabase
    .from("heroes")
    .select("*")
    .order("role", { ascending: true })
    .order("name", { ascending: true })

  return <HeroesClient heroes={heroes || []} />
}

"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { FinanceForm } from "@/components/admin/finance-form"
import { Tournament } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function AddFinancePage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournaments = async () => {
      const supabase = createClient()
      // Ambil data turnamen untuk pilihan di dropdown
      const { data } = await supabase
        .from("tournaments")
        .select("*")
        .order("start_date", { ascending: false })
      
      setTournaments(data || [])
      setLoading(false)
    }

    fetchTournaments()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Panggil FinanceForm tanpa initialData (karena ini mode Add)
  return <FinanceForm tournaments={tournaments} />
}
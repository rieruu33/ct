"use client"

import { useEffect, useState, use } from "react"
import { createClient } from "@/lib/supabase/client"
import { FinanceForm } from "@/components/admin/finance-form"
import { Tournament } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EditFinancePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const financeId = resolvedParams.id

  const [initialData, setInitialData] = useState<any>(null)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFinanceData = async () => {
      if (!financeId) return
      const supabase = createClient()

      try {
        setLoading(true)

        const [financeRes, tournamentsRes] = await Promise.all([
          supabase.from("finances").select("*").eq("id", parseInt(financeId)).single(),
          supabase.from("tournaments").select("*").order("start_date", { ascending: false })
        ])

        if (financeRes.error) throw financeRes.error

        setTournaments(tournamentsRes.data || [])
        setInitialData(financeRes.data)
      } catch (err: any) {
        console.error("Error fetching finance record:", err)
        setError("Gagal memuat data keuangan.")
      } finally {
        setLoading(false)
      }
    }

    fetchFinanceData()
  }, [financeId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Memuat data keuangan...</p>
      </div>
    )
  }

  if (error || !initialData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-500">
        {error || "Record not found."}
      </div>
    )
  }

  return <FinanceForm initialData={initialData} tournaments={tournaments} />
}
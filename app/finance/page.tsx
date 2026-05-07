import { createClient } from "@/lib/supabase/server"
import { FinanceClient } from "@/components/finance/finance-client"

export const revalidate = 0

export default async function FinancePage() {
  const supabase = await createClient()

  const { data: finances } = await supabase
    .from("finances")
    .select(`
      *,
      tournament:tournaments(*)
    `)
    .order("transaction_date", { ascending: false })

  // Get tournaments for reference
  const { data: tournaments } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false })

  // Calculate monthly summary for chart
  const monthlyData = new Map<string, { income: number; expense: number }>()
  
  finances?.forEach(f => {
    const month = f.transaction_date.substring(0, 7) // YYYY-MM
    const existing = monthlyData.get(month) || { income: 0, expense: 0 }
    if (f.type === "income") {
      existing.income += Number(f.amount)
    } else {
      existing.expense += Number(f.amount)
    }
    monthlyData.set(month, existing)
  })

  const chartData = Array.from(monthlyData.entries())
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
      profit: data.income - data.expense,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12) // Last 12 months

  // Calculate totals
  const totalIncome = finances?.filter(f => f.type === "income").reduce((sum, f) => sum + Number(f.amount), 0) || 0
  const totalExpense = finances?.filter(f => f.type === "expense").reduce((sum, f) => sum + Number(f.amount), 0) || 0

  return (
    <FinanceClient
      finances={finances || []}
      tournaments={tournaments || []}
      chartData={chartData}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
    />
  )
}

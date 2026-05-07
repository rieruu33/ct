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

  // 1. PISAHKAN MODAL AWAL DARI TRANSAKSI BIASA
  // Cari transaksi yang deskripsinya persis "INITIAL_BALANCE"
  const initialBalanceRecord = finances?.find(f => f.description === "INITIAL_BALANCE")
  const initialCash = initialBalanceRecord && initialBalanceRecord.type === "income" 
    ? Number(initialBalanceRecord.amount) 
    : 0

  // Buat daftar transaksi bersih (tanpa modal awal) untuk grafik dan riwayat
  const regularFinances = finances?.filter(f => f.description !== "INITIAL_BALANCE") || []

  // Calculate monthly summary for chart USING REGULAR FINANCES ONLY
  const monthlyData = new Map<string, { income: number; expense: number }>()
  
  regularFinances.forEach(f => {
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

  // Calculate totals USING REGULAR FINANCES ONLY
  const totalIncome = regularFinances.filter(f => f.type === "income").reduce((sum, f) => sum + Number(f.amount), 0)
  const totalExpense = regularFinances.filter(f => f.type === "expense").reduce((sum, f) => sum + Number(f.amount), 0)

  // 2. HITUNG SISA KAS TIM (Modal Awal + Total Pemasukan - Total Pengeluaran)
  const teamCash = initialCash + totalIncome - totalExpense

  return (
    <FinanceClient
      finances={regularFinances} // Melempar data bersih ke client
      tournaments={tournaments || []}
      chartData={chartData}
      totalIncome={totalIncome}
      totalExpense={totalExpense}
      teamCash={teamCash} // Melempar nilai Kas Tim ke client
    />
  )
}
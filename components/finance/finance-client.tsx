"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { Finance, Tournament } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { format } from "date-fns"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

interface FinanceWithTournament extends Finance {
  tournament: Tournament | null
}

interface ChartDataPoint {
  month: string
  income: number
  expense: number
  profit: number
}

interface FinanceClientProps {
  finances: FinanceWithTournament[]
  tournaments: Tournament[]
  chartData: ChartDataPoint[]
  totalIncome: number
  totalExpense: number
}

export function FinanceClient({ 
  finances, 
  chartData, 
  totalIncome, 
  totalExpense 
}: FinanceClientProps) {
  const balance = totalIncome - totalExpense

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatShortCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `Rp${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `Rp${(amount / 1000).toFixed(0)}K`
    }
    return `Rp${amount}`
  }

  return (
    <PageWrapper className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <DollarSign className="h-8 w-8" />
          Finance
        </h1>
        <p className="text-muted-foreground mt-1">Tournament income and expenses in Rupiah</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Net Balance</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${balance >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                  <Wallet className={`h-6 w-6 ${balance >= 0 ? "text-green-600" : "text-red-600"}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{finances.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Area Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(val) => format(new Date(val + "-01"), "MMM")}
                    className="text-xs"
                  />
                  <YAxis 
                    tickFormatter={formatShortCurrency}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => format(new Date(label + "-01"), "MMMM yyyy")}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stackId="1"
                    stroke="#22c55e"
                    fill="#22c55e"
                    fillOpacity={0.2}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stackId="2"
                    stroke="#ef4444"
                    fill="#ef4444"
                    fillOpacity={0.2}
                    name="Expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Profit/Loss by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(val) => format(new Date(val + "-01"), "MMM")}
                    className="text-xs"
                  />
                  <YAxis 
                    tickFormatter={formatShortCurrency}
                    className="text-xs"
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => format(new Date(label + "-01"), "MMMM yyyy")}
                  />
                  <Bar
                    dataKey="profit"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="Profit/Loss"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {finances.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No transactions recorded yet</p>
          ) : (
            <div className="space-y-2">
              {finances.map((finance, index) => (
                <motion.div
                  key={finance.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      finance.type === "income" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}>
                      {finance.type === "income" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{finance.description || "Transaction"}</p>
                      <p className="text-sm text-muted-foreground">
                        {finance.tournament?.name || "General"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      finance.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {finance.type === "income" ? "+" : "-"}{formatCurrency(Number(finance.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(finance.transaction_date), "MMM d, yyyy")}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageWrapper>
  )
}
